import { TUser } from "common/types/user/user.type";

const common500 = "Something went wrong, please contact support!";

export default (message, data, error = false) => ({
    error: !!error,
    message: message || (error ? common500 : "Success"),
    data,
});

export const createUserResponse = (user: TUser, userType:string) => {
    let userDetails = {
        ...user,
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        type:userType
    };
    return user;
};
