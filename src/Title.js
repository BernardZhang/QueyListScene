/**
 * @file Title
 * @author zhangyou
 */
import React from 'react';
import styled from 'styled-components';

const Title = styled.div`
    position: sticky;
    top: 0;
    height: 48px;
    background: #FFFFFF;
    line-height: 48px;
    padding: 0 20px;
    z-index: 1;

    & > span {
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
    }
`;

export default ({ title, children }) => (
    <Title>
        <span>{title}</span>
        <span>
            {children}
        </span>
    </Title>
);
