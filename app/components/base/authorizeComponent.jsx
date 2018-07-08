import React from 'react';
import Auth from '../../utils/auth.js'

export default class AuthorizeComponent extends React.Component {

    render() {
         
        if (this.isValid()) {

           return <div>{ this.props.children}</div>
        }

        if (this.props.hideChildren) {

            return null;

        } else {

            return <p>You are not allowed to do this operation</p>
        }
    }

    isValid() {

        if (this.props.pageName) {

            return Auth.checkAuthorized(this.props.pageName)

        }

        return true;


        // if(Array.isArray(this.props.operationCode)) {

        //     let isAuthorized = false;

        //     this.props.operationCode.forEach((i) => {

        //         if(!isAuthorized) {

        //             isAuthorized = Auth.isAuthorized(i)
        //         }
        //     });

        //     return isAuthorized;
        // } else {

        //     return Auth.isAuthorized(this.props.operationCode);
        // }
    }
}


AuthorizeComponent.PropTypes = {
    pageName: React.PropTypes.string,
    hideChildren: React.PropTypes.bool
}