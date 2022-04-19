import { Application } from "@feathersjs/express";
import Axios, { AxiosRequestConfig } from "axios";
import logger from "../logger";
import { UndefinedAppError } from "../models/errors";
import { loadJSON } from "./load-config-file";
import { sleep } from "./sleep";


enum AgentMode {
  AcaPy = "ACAPY",
  Traction = "TRACTION"
}


export class AcaPyUtils {
  static instance: AcaPyUtils;
  app: Application;

  private constructor(app: Application) {
    this.app = app;
  }

  static getInstance(app?: Application): AcaPyUtils {
    if (!this.instance) {
      if (!app) {
        throw new UndefinedAppError(
          "Error creating a new instance of [AcaPyUtils]: no app was provided"
        );
      }
      this.instance = new AcaPyUtils(app);
      logger.debug("Created new instance of [AcaPyUtils]");
    }
    return this.instance;
  }

  async makeAgentPost(url_part: string, data?: any): Promise<any> {
    const url = `${this.getAdminUrl()}${url_part}`;
    logger.debug(`POST ${url}`)
    const response = await Axios.post(
      url,
      data,
      this.getRequestConfig()
    );
    return response;
  }

  async makeAgentGet(url_part: string): Promise<any> {
    const url = `${this.getAdminUrl()}${url_part}`;
    logger.debug(`GET ${url}`)
    const response = await Axios.get(
      url,
      this.getRequestConfig()
    );
    return response;
  }

  isTractionBackend(): boolean {
    logger.debug(`Check if traction mode ... ${this.app.get("agent").mode}`);
    const is_traction = (this.app.get("agent").mode === AgentMode.Traction);
    logger.debug(`... returns ${is_traction}`);
    return is_traction;
  }

  tenantBearerToken(): string {
    return 'TODO';
  }

  getRequestConfig(): AxiosRequestConfig {
    // if we're running on traction we need an additional param
    let requestConfig;
    if (this.isTractionBackend()) {
      requestConfig = {
        headers: {
          "x-api-key": this.app.get("agent").adminApiKey || "",
          "Authorization": `Bearer ${this.tenantBearerToken()}`,
        },
      };
    } else {
      requestConfig = {
        headers: {
          "x-api-key": this.app.get("agent").adminApiKey || "",
        },
      };
    }
    return requestConfig as AxiosRequestConfig;
  }

  getAdminUrl(): string {
    // admin url depends if we are running on traction (default aca-py)
    if (this.isTractionBackend()) {
      return `${this.app.get("traction").endpoint}${this.app.get("traction").acapyWrapperPrefix}`;
    } else {
      return this.app.get("agent").adminUrl;
    }
  }

  async init() {
    // wait for the agent to be ready (aca-py only) (assume traction is already started)
    if (!(this.isTractionBackend())) {
      while (!(await this.isAgentReady())) {
        logger.debug("Agent not ready, retrying in 500ms...");
        await sleep(500);
      }
    }
  }

  async isAgentReady(): Promise<boolean> {
    const url = `${this.getAdminUrl()}/status/ready`;
    let result;
    try {
      const response = await Axios.get(url, this.getRequestConfig());
      result = response.status === 200 ? true : false;
    } catch (error) {
      result = false;
    }
    return Promise.resolve(result);
  }
}
