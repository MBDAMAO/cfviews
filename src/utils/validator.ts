export const isEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const isURL = (url: string) => {
    const re = /^(http|https):\/\/[^ "]+$/;
    return re.test(url);
};
