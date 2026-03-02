import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { AxiosError } from "axios";
import { safeParseJson } from "./json.js";
export class ApiResponseError extends Error {
    code;
    message;
    constructor(code, message, options) {
        super(message, {
            ...options,
        });
        this.code = code;
        this.message = message;
        this.name = "ApiResponseError";
    }
}
export const catchErrorResponse = (data) => {
    if (typeof data !== "string" && typeof data !== "object")
        return String(data);
    const parsedData = typeof data === "string" ? (safeParseJson(data) ?? {}) : data;
    const detail = parsedData?.["detail"];
    if (typeof detail === "string") {
        return detail;
    }
    if (typeof detail === "object") {
        if (Array.isArray(detail)) {
            return detail.map(({ msg } = { msg: "" }) => msg).join(", ");
        }
        else {
            return detail["message"] ?? detail["msg"] ?? JSON.stringify(detail);
        }
    }
    const message = parsedData?.["message"] ??
        parsedData?.["msg"] ??
        JSON.stringify(parsedData);
    return message;
};
export const handleAxiosError = (error) => {
    if (error instanceof AxiosError) {
        if (error.response?.status) {
            let message = error.message;
            if (error.response.status >= 400 && error.response.status < 500) {
                message = catchErrorResponse(error.response.data);
            }
            throw new ApiResponseError(error.response.status, message, {
                cause: error,
            });
        }
    }
    if (error instanceof Error) {
        throw new ApiResponseError(-1, error.message, {
            cause: error,
        });
    }
    if (typeof error === "object" && error !== null) {
        throw new ApiResponseError(-1, JSON.stringify(error), {
            cause: error,
        });
    }
    throw new ApiResponseError(-1, String(error), {
        cause: error,
    });
};
const findApiResponseError = (error) => {
    if (!(error instanceof Error))
        return null;
    if (error instanceof ApiResponseError)
        return error;
    return findApiResponseError(error.cause);
};
export const TalesofaiMcpErrorCodes = {
    ...ErrorCode,
    /**
     * 自定义 MCP 错误代码
     */
    /**
     * API 响应错误（业务逻辑异常）
     */
    ApiResponseError: -32700,
    /**
     * 上游服务不可用
     */
    ServiceUnavailable: -32701,
    /**
     * 上游服务网关错误
     */
    ServiceGatewayError: -32702,
    /**
     * 上游服务请求超时
     */
    ServiceRequestTimeout: -32703,
    /**
     * 上游服务内部错误
     */
    ServiceRequestError: -32704,
    /**
     * 未登录
     */
    NotLogin: -32720,
    /**
     * 电量不足
     */
    InsufficientPower: -32721,
    /**
     * 输入违规
     */
    IllegalInput: -32722,
    /**
     * 任务队列已满
     */
    TaskQueueFull: -32723,
    /**
     * 异常输入 -32800 ~ -32899
     */
    ManuscriptNotFound: -32800,
    NoValidAssigns: -32801,
    NoValidVersePreset: -32802,
    NoValidVerseUiComponent: -32803,
    CharacterNotFound: -32804,
    /**
     * 角色或元素不存在
     */
    TcpNotFound: -32805,
    /**
     * 角色或元素类型不匹配
     */
    TcpTypeMismatch: -32806,
};
export class TalesofaiMcpError extends McpError {
    constructor(code, message, options) {
        let data;
        const apiResponseError = findApiResponseError(options?.cause);
        if (apiResponseError) {
            data = {
                api_error: {
                    code: apiResponseError.code,
                    message: apiResponseError.message,
                },
            };
        }
        super(code, message, data);
        this.name = "TalesofaiMcpError";
        const stacks = [];
        if (this.stack) {
            stacks.push(this.stack);
        }
        if (options?.cause instanceof Error && options?.cause.stack) {
            stacks.push(options?.cause.stack);
        }
        this.message = JSON.stringify({
            name: "TalesofaiMcpError",
            code,
            message,
            data,
            stack: stacks.join("\n\n"),
        });
    }
}
