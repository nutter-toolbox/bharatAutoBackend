export type TLeads = {
    id?: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone_code:string;
    phoneNumber: string;
    company: string;
    status: string;
    source: string;
};

export type ConvertLead = {
    status: string,
    comment: string
}
