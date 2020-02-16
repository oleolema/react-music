import React, {Component} from 'react';
import {CSSTransition, TransitionGroup, SwitchTransition} from "react-transition-group";
import classNames from "classnames";
import {Switch, withRouter} from "react-router-dom";
import propTypes from "prop-types";


class AnimationRoute extends Component {


    constructor(props) {
        super(props);
    }

    render() {
        //当前路由是否为当前页面
        const regExp = this.props.children.props.path.replace(/:.+/g, '.+');
        const result = this.props.location.pathname.search(regExp) !== -1;
        // console.info(result);
        return (
            <div className={'animation-router'}>

                <SwitchTransition className={'router-wrapper'}>
                    <CSSTransition
                        key={this.props.location.pathname}
                        classNames={'fade'}
                        timeout={300}
                    >{result ?
                        <div
                            className={classNames('router-route', {
                                'router-route-singer': this.props.location.pathname.startsWith('/singer/'),
                            })}
                            style={{
                                position: this.props.position,
                            }}
                        >
                            <Switch location={this.props.location}>
                                {this.props.children}
                            </Switch>
                        </div>
                        : <></>
                    }
                    </CSSTransition>
                </SwitchTransition>

            </div>
        );
    }

}

AnimationRoute.propTypes = {
    position: propTypes.string,
};

AnimationRoute.defaultProps = {
    position: "fixed"
};

export default withRouter(AnimationRoute);