module Atax
{
    export enum Method
    {
        GET,
        POST,
        PUT,
        DELETE,
        OPTIONS,
        HEAD,
        PATCH
    }
    export function Request<TResponse, TError, TParams>(method: Method | string, url: string, queryString?: any | Array<Array<string>>, body?: any | Array<Array<string>>)
    {

    }
    export function Get<TResponse, TError, TParams>(url: string):  number
    {
        return 0;
    }
    
    interface ParamsSerializer
    {
        GetParams(obj: string | any): Array<Array<string>>;
    }
    class MsParamsSerializer implements ParamsSerializer
    {
        GetParams(obj: string | any): Array<Array<string>>
        {
            if (typeof(obj) == 'string')
                return this.ArrayFromString(<string>obj);
            else
                return this.ArrayFromObject(obj);
        }
        //TODO: Allow to inject custom serializers for different kind of objects
        // GetSerializer(ctor: any)
        // {

        // }
        ArrayFromString(str: string): Array<Array<string>>
        {
            var ret = [];

            return ret;
        }
        ArrayFromObject(obj: any, prefix?: string): Array<Array<string>>
        {
            var ret = [];
            var t,v,c,k;
            for (var key in obj)
            {
                k = (prefix ? "" : prefix + ".") + key;
                v = obj[key];
                t = typeof(v);
                if (t == 'string')
                    ret.push(k, v);
                else if (t == 'number')
                    ret.push(k, v);
                else if (t == 'boolean')
                    ret.push(k, v ? 'true' : 'false');
                else if (t == 'object')
                {
                    var c = v.constructor;
                    if (c == Array)
                    {
                        for (var i=0; i<v.length; i++)
                            ret.concat(this.ArrayFromObject(v, k + '[' + i + ']'));
                    }
                    else if (c == Date)
                    {
                    }
                    //TODO: Add remaining types
                }
                
                
            }
            return ret;
        }
    }

    export class XHR
    {
        method: string;
        url: string;
        queryString: Array<Array<string>> = [];
        body: string = '';
        paramsSerializer: ParamsSerializer;
        

        constructor(method: Method | string, url: string, queryString?: string | any | Array<Array<string>>, body?: any | Array<Array<string>>)
        {
            this.paramsSerializer = new MsParamsSerializer();
            this.method = typeof(method) == "string" ? method : method.toString();
            this.url = url;
            this.SetQueryString(queryString);
        }
        private SetQueryString(queryString?: string | any | Array<Array<string>>)
        {
            if (!queryString)
                this.queryString = [];
            else
                this.queryString = queryString ? (queryString.constructor == Array ? queryString : this.paramsSerializer.GetParams(queryString)) : [];
        }
    }
}