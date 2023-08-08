import axios from "axios";

const GET_USER_THREADS_DOC_ID = "7103745679657481";
const GET_USER_DOC_ID = "9943275619045977";
const GET_USER_REPLIES_DOC_ID = "6609286839136148";
const GET_POST_DOC_ID = "6360770497343734";
const GET_POST_LIKERS_DOC_ID = "9360915773983802";

const X_IG_APP_ID = "238260118697367";
const X_ASBD_ID = "129477";

const THREAD_API_URL = "https://www.threads.net/api/graphql/";

class Client {

    THREAD_URL: string;
    defaultHeaders: {};
    apiToken: any;
    fetchHeaders: {};

    username: string;
    userId: any;

    constructor() {
        this.THREAD_URL = THREAD_API_URL;
        this.username = "instagram"; 

        this.apiToken = '';
        this.userId = this.getUserId();

        this.defaultHeaders = {
            'Authority': 'www.threads.net',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://www.threads.net',
            'Pragma': 'no-cache',
            'Sec-Fetch-Site': 'same-origin',
            'X-ASBD-ID': X_ASBD_ID,
            'X-IG-App-ID': X_IG_APP_ID,
        }

        this.fetchHeaders = {
            'Authority': 'www.threads.net',
            'Accept': (
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'),
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://www.threads.net',
            'Pragma': 'no-cache',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': (
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6)AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.2 Safari/605.1.15'
            ),
        }
    }

    async getUserId() {
        try {
            const headers = this.fetchHeaders;

            if (this.apiToken && this.userId) {
                return this.userId;
            }

            let { data } = await axios.get(`https://www.threads.net/@${this.username}`, { headers: headers });

            const lsdToken: string = data.match(/"LSD",\[\],{"token":"(\w+)"},\d+\]/)?.[1];
            const userID: string = data.match(/"props":{"user_id":"(\d+)"/)[1];

            this.apiToken = lsdToken;

            console.log(`LSD Token: ${lsdToken}, User Id: ${userID}`);
            return userID;
        }
        catch {
            return {
                statusCode: "400",
                body: 'Something went wrong'
            }
        }
    }

    async getThreads() {
        try {
            let payload = {
                "lsd": this.apiToken,
                "variables": JSON.stringify({ "userID": this.userId }),
                "doc_id": GET_USER_THREADS_DOC_ID
            }

            let res = await axios.post(this.THREAD_URL, payload, {
                headers: { ...this.defaultHeaders, 'X-Fb-Friendly-Name': 'BarcelonaProfileThreadsTabQuery' },
            });
            console.log('Threads: ', res);
            return res;
        }
        catch {
            return {
                statusCode: 404,
                body: 'User Not Found'
            }
        }
    }

    async getUser() {
        try {
            let payload = {
                "lsd": this.apiToken,
                "variables": JSON.stringify({ "userID": this.userId }),
                "doc_id": GET_USER_DOC_ID
            }
            let res = await axios.post(this.THREAD_URL, payload, {
                headers: { ...this.defaultHeaders, 'X-FB-LSD': this.apiToken, 'X-Fb-Friendly-Name': 'BarcelonaProfileRootQuery' },
            });

            console.log('User: ', res);
            return res;
        }
        catch {
            return {
                statusCode: 404,
                body: 'User Not Found'
            }
        }
    }

    async getReplies() {
        try {
            let payload = {
                "lsd": this.apiToken,
                "variables": JSON.stringify({ "userID": this.userId }),
                "doc_id": GET_USER_REPLIES_DOC_ID
            }
            let res = await axios.post(this.THREAD_URL, payload, {
                headers: { ...this.defaultHeaders, 'X-FB-LSD': this.apiToken, 'X-Fb-Friendly-Name': 'BarcelonaProfileRepliesTabQuery' },
            });

            console.log('User Replies: ', res.data);
            return res;
        }
        catch {
            return {
                statusCode: "400",
                body: 'Something went wrong'
            }
        }
    }

    async getThread(threadId: any) {
        try {
            let payload = {
                "lsd": this.apiToken,
                "variables": JSON.stringify({ "postID": threadId }),
                "doc_id": GET_POST_DOC_ID
            }
            let res = await axios.post(this.THREAD_URL, payload, {
                headers: { ...this.defaultHeaders, 'X-FB-LSD': this.apiToken, 'X-Fb-Friendly-Name': 'BarcelonaPostPageQuery' },
            });

            console.log('Thread: ', res.data);
            return res;
        }
        catch {
            return {
                statusCode: 404,
                body: 'User Not Found'
            }
        }
    }

    async getThreadLikers(threadId: any) {
        try {
            let payload = {
                "lsd": this.apiToken,
                "variables": JSON.stringify({ "postID": threadId }),
                "doc_id": GET_POST_LIKERS_DOC_ID
            }
            let res = await axios.post(this.THREAD_URL, payload, {
                headers: { ...this.defaultHeaders, 'X-FB-LSD': this.apiToken },
            });

            console.log('Thread Likers: ', res.data);
            return res;
        }
        catch {
            return {
                statusCode: 404,
                body: 'User Not Found'
            }
        }
    }

}

export const client = new Client();