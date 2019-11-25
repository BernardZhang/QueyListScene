import React from 'react';
import styled from 'styled-components';

const Toolbar = styled.div`
    padding: 16px 16px 12px;
    background: #fff;

    & > *:not(:last-child) {
        margin-right: 12px;
    }
`;

export default class QslToolbar extends React.Component {
    render() {
        return (
            <Toolbar>
                {this.props.children}
            </Toolbar>
        );
    }
}
