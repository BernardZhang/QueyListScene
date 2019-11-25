import React from 'react';
import styled from 'styled-components';
import Title from './Title';
import createActions from './createActions';

const QueryListWrapper = styled.div`
    position: relative;
`;

const Content = styled.div`
    background: #EFF2F5;
    padding: 16px 20px;
`;

export default class QueryListScene extends React.Component {
    constructor(props) {
        super(props);
        this.actions = props.actions || createActions();
    }

    render() {
        const {title, children, className = ''} = this.props;

        return (
            <QueryListWrapper className={className}>
                {
                    title && <Title title={title} />
                }
                <Content>
                    {
                        React.Children.map(
                            children, child => child && React.cloneElement(child, {
                                qlsProps: this.props,
                                actions: this.actions
                            }
                        ))
                    }
                </Content>
            </QueryListWrapper>
        );
    }
}
