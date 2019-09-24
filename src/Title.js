/**
 * @file Title
 * @author zhangyou
 */
import React from 'react';

export default ({ title, children }) => {
    return (
        <div className="title">
            <span>{title}</span>
            <span>
                {children}
            </span>
        </div>
    );
};
