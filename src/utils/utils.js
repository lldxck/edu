import { Message } from 'element-ui';
export default {
    showMessage: (type, message) => {
        Message({
            message,
            type,
        });
    }
}