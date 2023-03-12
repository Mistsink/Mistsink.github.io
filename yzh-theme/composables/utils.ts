export const useScrollToBottom = (call: Function) => {
    return () => {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let clientHeight = document.documentElement.clientHeight;
        let scrollHeight = document.documentElement.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
            call()
        }
    }
}

