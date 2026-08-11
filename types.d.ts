declare global {
  type TeqFw_Web_Back_Api_Handler = import("./src/Back/Api/Handler.mjs").default;
  type TeqFw_Web_Back_Api_Handler__Class = typeof import("./src/Back/Api/Handler.mjs").default;

  type TeqFw_Web_Back_Config_Runtime = import("./src/Back/Config/Runtime.mjs").Data;
  type TeqFw_Web_Back_Config_Runtime_Tls = import("./src/Back/Config/Runtime/Tls.mjs").Data;
  type TeqFw_Web_Back_Config_Runtime_Tls__Class = typeof import("./src/Back/Config/Runtime/Tls.mjs").default;
  type TeqFw_Web_Back_Config_Runtime_Tls__Data = import("./src/Back/Config/Runtime/Tls.mjs").Data;
  type TeqFw_Web_Back_Config_Runtime_Tls__Factory = import("./src/Back/Config/Runtime/Tls.mjs").Factory;
  type TeqFw_Web_Back_Config_Runtime_Tls__Factory__Class = typeof import("./src/Back/Config/Runtime/Tls.mjs").Factory;
  type TeqFw_Web_Back_Config_Runtime__Class = typeof import("./src/Back/Config/Runtime.mjs").default;
  type TeqFw_Web_Back_Config_Runtime__Data = import("./src/Back/Config/Runtime.mjs").Data;
  type TeqFw_Web_Back_Config_Runtime__Factory = import("./src/Back/Config/Runtime.mjs").Factory;
  type TeqFw_Web_Back_Config_Runtime__Factory__Class = typeof import("./src/Back/Config/Runtime.mjs").Factory;

  type TeqFw_Web_Back_Dto_Info = import("./src/Back/Dto/Info.mjs").default;
  type TeqFw_Web_Back_Dto_Info__Class = typeof import("./src/Back/Dto/Info.mjs").default;
  type TeqFw_Web_Back_Dto_Info__Factory = import("./src/Back/Dto/Info.mjs").Factory;
  type TeqFw_Web_Back_Dto_Info__Factory__Class = typeof import("./src/Back/Dto/Info.mjs").Factory;

  type TeqFw_Web_Back_Dto_RequestContext = import("./src/Back/Dto/RequestContext.mjs").default;
  type TeqFw_Web_Back_Dto_RequestContext__Class = typeof import("./src/Back/Dto/RequestContext.mjs").default;
  type TeqFw_Web_Back_Dto_RequestContext__Factory = import("./src/Back/Dto/RequestContext.mjs").Factory;
  type TeqFw_Web_Back_Dto_RequestContext__Factory__Class = typeof import("./src/Back/Dto/RequestContext.mjs").Factory;

  type TeqFw_Web_Back_Dto_Source = import("./src/Back/Dto/Source.mjs").default;
  type TeqFw_Web_Back_Dto_Source__Class = typeof import("./src/Back/Dto/Source.mjs").default;
  type TeqFw_Web_Back_Dto_Source__Factory = import("./src/Back/Dto/Source.mjs").Factory;
  type TeqFw_Web_Back_Dto_Source__Factory__Class = typeof import("./src/Back/Dto/Source.mjs").Factory;

  type TeqFw_Web_Back_Enum_Server_Type = import("./src/Back/Enum/Server/Type.mjs").default;
  type TeqFw_Web_Back_Enum_Server_Type__Class = typeof import("./src/Back/Enum/Server/Type.mjs").default;
  type TeqFw_Web_Back_Enum_Stage = import("./src/Back/Enum/Stage.mjs").default;
  type TeqFw_Web_Back_Enum_Stage__Class = typeof import("./src/Back/Enum/Stage.mjs").default;

  type TeqFw_Web_Back_Handler_Pre_Log = import("./src/Back/Handler/Pre/Log.mjs").default;
  type TeqFw_Web_Back_Handler_Pre_Log__Class = typeof import("./src/Back/Handler/Pre/Log.mjs").default;
  type TeqFw_Web_Back_Handler_Static = import("./src/Back/Handler/Static.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Config = import("./src/Back/Handler/Static/A/Config.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Config__Class = typeof import("./src/Back/Handler/Static/A/Config.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Config__Value = import("./src/Back/Handler/Static/A/Config.mjs").Value;
  type TeqFw_Web_Back_Handler_Static_A_Fallback = import("./src/Back/Handler/Static/A/Fallback.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Fallback__Class = typeof import("./src/Back/Handler/Static/A/Fallback.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_FileService = import("./src/Back/Handler/Static/A/FileService.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_FileService__Class = typeof import("./src/Back/Handler/Static/A/FileService.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Registry = import("./src/Back/Handler/Static/A/Registry.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Registry__Class = typeof import("./src/Back/Handler/Static/A/Registry.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Registry__Match = import("./src/Back/Handler/Static/A/Registry.mjs").Match;
  type TeqFw_Web_Back_Handler_Static_A_Resolver = import("./src/Back/Handler/Static/A/Resolver.mjs").default;
  type TeqFw_Web_Back_Handler_Static_A_Resolver__Class = typeof import("./src/Back/Handler/Static/A/Resolver.mjs").default;
  type TeqFw_Web_Back_Handler_Static_Init_Params = {sources?: TeqFw_Web_Back_Dto_Source[]};
  type TeqFw_Web_Back_Handler_Static__Class = typeof import("./src/Back/Handler/Static.mjs").default;

  type TeqFw_Web_Back_Helper_Cast = import("./src/Back/Helper/Cast.mjs").default;
  type TeqFw_Web_Back_Helper_Cast_Enum_Options = {lower?: boolean; upper?: boolean};
  type TeqFw_Web_Back_Helper_Cast__Class = typeof import("./src/Back/Helper/Cast.mjs").default;
  type TeqFw_Web_Back_Helper_Mime = import("./src/Back/Helper/Mime.mjs").default;
  type TeqFw_Web_Back_Helper_Mime__Class = typeof import("./src/Back/Helper/Mime.mjs").default;
  type TeqFw_Web_Back_Helper_Order_Kahn = import("./src/Back/Helper/Order/Kahn.mjs").default;
  type TeqFw_Web_Back_Helper_Order_Kahn__Class = typeof import("./src/Back/Helper/Order/Kahn.mjs").default;
  type TeqFw_Web_Back_Helper_Respond = import("./src/Back/Helper/Respond.mjs").default;
  type TeqFw_Web_Back_Helper_Respond__Class = typeof import("./src/Back/Helper/Respond.mjs").default;

  type TeqFw_Web_Back_PipelineEngine = import("./src/Back/PipelineEngine.mjs").default;
  type TeqFw_Web_Back_PipelineEngine__Class = typeof import("./src/Back/PipelineEngine.mjs").default;
  type TeqFw_Web_Back_Pipeline_RequestContext = TeqFw_Web_Back_Dto_RequestContext & {[key: symbol]: string | null};
  type TeqFw_Web_Back_Request_Target = {method?: string; url?: string};
  type TeqFw_Web_Back_Response_Body = string | object;
  type TeqFw_Web_Back_Response_Headers = {[key: string]: string | number | string[]};
  type TeqFw_Web_Back_Response_Payload = {
    res: TeqFw_Web_Back_Response_Target;
    headers?: TeqFw_Web_Back_Response_Headers;
    body?: TeqFw_Web_Back_Response_Body;
  };
  type TeqFw_Web_Back_Response_Target = NodeJS.WritableStream & {
    end(body?: unknown): void;
    headersSent: boolean;
    writableEnded: boolean;
  };
  type TeqFw_Web_Back_Server = import("./src/Back/Server.mjs").default;
  type TeqFw_Web_Back_Server_Instance = import("node:http").Server | import("node:http2").Http2Server | import("node:http2").Http2SecureServer;
  type TeqFw_Web_Back_Server__Class = typeof import("./src/Back/Server.mjs").default;
  type TeqFw_Web_Cli_Command_Start = import("./src/Cli/Command/Start.mjs").default;
  type TeqFw_Web_Cli_Command_Start_Handle = {done: Promise<void>; stop: () => Promise<void>};
  type TeqFw_Web_Cli_Command_Start__Class = typeof import("./src/Cli/Command/Start.mjs").default;

}

export {};
