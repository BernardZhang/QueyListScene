import EventEmitter from "eventemitter3";
import { get, set } from "lodash";


export default () => {
    const eventEmitter = new EventEmitter();
    const data = {
        dataSource: [],
        formData: {}
    };

    return {
        setData: (key, val) => {
            set(data, key, val);
        },

        getFormData: name => get(data, `formData${name ? ('.' + name) : ''}`),
        getTableDataSource: () => get(data, "dataSource"),
        getPagination: () => get(data, "pagination"),

        setFormData: data => {
            eventEmitter.emit("setFormData", data);
        },
        setTableDataSource: dataSource => {
            eventEmitter.emit("setTableDataSource", dataSource);
        },
        setPagination: pagination => {
            eventEmitter.emit("setPagination", pagination);
        },
    
        search: (params = {}, showLoading = true) => {
            return new Promise((resolve, reject) => {
                eventEmitter.emit("search", params, {
                    callback: resolve,
                    showLoading
                });
            });
        },

        on: (eventName, callback) => {
            eventEmitter.on(eventName, callback);
        },

        emit: (...args) => {
            eventEmitter.emit(...args);
        },

        removeListener: (...args) => {
            eventEmitter.removeListener(...args);
        }
    };
};
