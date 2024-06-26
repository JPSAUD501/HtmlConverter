/* eslint-disable */
export default async () => {
    const t = {
        ["./app.dto"]: await import("./app.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./app.dto"), { "GetVersionResponseDto": { version: { required: true, type: () => String } }, "ConvertHtmlToImageRequestDto": { html: { required: true, type: () => String } }, "ConvertHtmlToImageResponseDto": { data: { required: true, type: () => String } } }]], "controllers": [[import("./app.controller"), { "AppController": { "getHealth": { type: String }, "getVersion": { type: t["./app.dto"].GetVersionResponseDto }, "getScalar": {}, "getOpenApiJson": { type: Object }, "getOpenApiDefaultInterface": {}, "getOpenApiInterface": {}, "getFixOpenApiInterfaceRedirection": {}, "convertHtmlToPng": { type: t["./app.dto"].ConvertHtmlToImageResponseDto } } }]] } };
};