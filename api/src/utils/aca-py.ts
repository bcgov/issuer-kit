import { Application } from "@feathersjs/express";
import Axios, { AxiosRequestConfig } from "axios";
import logger from "../logger";
import { UndefinedAppError } from "../models/errors";
import { loadJSON } from "./load-config-file";
import { sleep } from "./sleep";

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
    const response = await Axios.post(
      url,
      data,
      this.getRequestConfig()
    );
    return response;
  }

  async makeAgentGet(url_part: string): Promise<any> {
    const url = `${this.getAdminUrl()}${url_part}`;
    const response = await Axios.get(
      url,
      this.getRequestConfig()
    );
    return response;
  }

  getRequestConfig(): AxiosRequestConfig {
    return {
      headers: {
        "x-api-key": this.app.get("agent").adminApiKey || "",
      },
    } as AxiosRequestConfig;
  }

  getAdminUrl(): string {
    return this.app.get("agent").adminUrl;
  }

  async init() {
    // wait for the agent to be ready
    while (!(await this.isAgentReady())) {
      logger.debug("Agent not ready, retrying in 500ms...");
      await sleep(500);
    }
  }

  async isAgentReady(): Promise<boolean> {
    const url = `${this.app.get("agent").adminUrl}/status/ready`;
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
