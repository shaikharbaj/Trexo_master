export interface CreateContactUsBody {
    business_email: string;
    name: string;
    message: string;
    is_active?: boolean;
}

export interface ReplyContactUsBody {
    reply_message: string;
    is_active?: boolean;
}
