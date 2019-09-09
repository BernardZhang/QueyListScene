import React from 'react';

export default class Toolbar extends React.Component {
    render() {
        return (
            <div className='query-list-scene-toolbar'>
                {this.props.children}
            </div>
            );
    }
}
