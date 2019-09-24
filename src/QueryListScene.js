import React from 'react';
import Title from './Title';
import createActions from './createActions';

export default class QueryListScene extends React.Component {
    constructor(props) {
        super(props);
        this.actions = props.actions || createActions();
    }

    render() {
        const {title, children, className = ''} = this.props;

        return (
            <div className={`query-list-scene ${className}`}>
                {
                    title && (
                       <Title title={title} />
                    ) 
                }
                <div className="query-list-scene-content">
                    {
                        React.Children.map(children, child => child && React.cloneElement(child, {
                            qlsProps: this.props,
                            actions: this.actions
                        }))
                    }
                </div>
            </div>
        );
    }
}
