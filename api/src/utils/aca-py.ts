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
  _tenantBearerToken: any;
  _innkeeperBearerToken: any;

  private constructor(app: Application) {
    this.app = app;
    this._tenantBearerToken = null;
    this._innkeeperBearerToken = null;
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

  async setTenantBearerToken(wallet_id: string, wallet_key: string) {
    if (!this._tenantBearerToken) {
      // login to get a bearer token
      const url = `${this.getTractionTenantUrl()}/token`;
      logger.debug(`Login to traction tenant using ${url}`)
      const user = wallet_id;
      const pwd = wallet_key;
      const data = `grant_type=&username=${user}&password=${pwd}&scope=&client_id=&client_secret=`
      const response = await Axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accept": "application/json"
        }
      });
      this._tenantBearerToken = response.data.access_token;
      logger.debug(`Traction tenant access token is REDACTED`)
    }
  }

  tenantBearerToken(): string {
    return this._tenantBearerToken;
  }

  getTractionTenantUrl(): string {
    if (this.isTractionBackend()) {
      return `${this.app.get("traction").endpoint}${this.app.get("traction").tenantPrefix}`;
    } else {
      return '';
    }
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
      while (!(await this.isAcaPyReady())) {
        logger.debug("Aca-Py agent not ready, retrying in 500ms...");
        await sleep(500);
      }
    }
  }

  async isAcaPyReady(): Promise<boolean> {
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

  async makeTractionInnkeeperPost(url_part: string, data?: any): Promise<any> {
    const url = `${this.getTractionInnkeeperUrl()}${url_part}`;
    logger.debug(`POST ${url}`)
    const response = await Axios.post(
      url,
      data,
      this.getTractionInnkeeperRequestConfig()
    );
    return response;
  }

  async makeTractionInnkeeperGet(url_part: string): Promise<any> {
    const url = `${this.getTractionInnkeeperUrl()}${url_part}`;
    logger.debug(`GET ${url}`)
    const response = await Axios.get(
      url,
      this.getTractionInnkeeperRequestConfig()
    );
    return response;
  }

  async makeTractionTenantPost(url_part: string, data?: any): Promise<any> {
    const url = `${this.getTractionTenantUrl()}${url_part}`;
    logger.debug(`POST ${url}`)
    const response = await Axios.post(
      url,
      data,
      this.getRequestConfig()
    );
    return response;
  }

  async makeTractionTenantGet(url_part: string): Promise<any> {
    const url = `${this.getTractionTenantUrl()}${url_part}`;
    logger.debug(`GET ${url}`)
    const response = await Axios.get(
      url,
      this.getRequestConfig()
    );
    return response;
  }

  async createIssuerTenant(name: string): Promise<any> {
    // first authenticate as innkeeper
    await this.setInnkeeperBearerToken();

    // create a new tenant
    const tenantInfoResponse = await this.makeTractionInnkeeperPost(
      '/v0/check-in',
      {"name": name, "webhook_url": "tbd"},
    );
    const tenantInfo = tenantInfoResponse.data;
    logger.debug(`tenant info: ${tenantInfo}`)

    // make the tenant an issuer
    let url_part = `/v0/issuers/${tenantInfo['id']}`;
    const tenantIssuerInfoResponse = await this.makeTractionInnkeeperPost(
      url_part,
      {},
    );
    const tenantIssuerInfo = tenantIssuerInfoResponse;
    logger.debug(`tenant issuer info: ${tenantIssuerInfo}`)

    // now authenticate as the tenant
    await this.setTenantBearerToken(tenantInfo['wallet_id'], tenantInfo['wallet_key']);

    // complete the tenant/issuer process
    const tenantIssuerResponse = await this.makeTractionTenantPost(
      '/v0/admin/issuer'
    );
    const tenantIssuer = tenantIssuerResponse.data;
    let isIssuer = false;
    let i = 0;
    while (i < 20) {
      await sleep(500);
      let tenantIssuerStatusResponse = await this.makeTractionTenantGet(
        '/v0/admin/issuer'
      );
      let tenantIssuerStatus = tenantIssuerStatusResponse.data;
      if (tenantIssuerStatus['workflow']['workflow_state'] === 'completed') {
        return {
          id: tenantInfo['id'],
          wallet_id: tenantInfo['wallet_id'],
          wallet_key: tenantInfo['wallet_key'],
          public_did: tenantIssuerStatus['issuer']['public_did']
        };
      }
      i = i + 1;
    }

    return null;
  }

  async setInnkeeperBearerToken() {
    if (!this._innkeeperBearerToken) {
      // login to get a bearer token
      const url = `${this.getTractionInnkeeperUrl()}/token`;
      logger.debug(`Login to traction innkeeper using ${url}`)
      const user = this.app.get("traction").innkeeperUser;
      const pwd = this.app.get("traction").innkeeperPassword;
      const data = `grant_type=&username=${user}&password=${pwd}&scope=&client_id=&client_secret=`
      const response = await Axios({
        method: 'post',
        url: url,
        data: data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "accept": "application/json"
        }
      });
      this._innkeeperBearerToken = response.data.access_token;
      logger.debug(`Traction innkeeper access token is REDACTED`)
    }
  }

  innkeeperBearerToken(): string {
    return this._innkeeperBearerToken;
  }

  getTractionInnkeeperRequestConfig(): AxiosRequestConfig {
    let requestConfig;
    if (this.isTractionBackend()) {
      requestConfig = {
        headers: {
          "Authorization": `Bearer ${this.innkeeperBearerToken()}`,
        },
      };
    } else {
      requestConfig = null;
    }
    return requestConfig as AxiosRequestConfig;
  }

  getTractionInnkeeperUrl(): string {
    if (this.isTractionBackend()) {
      return `${this.app.get("traction").endpoint}${this.app.get("traction").innkeeperPrefix}`;
    } else {
      return '';
    }
  }
}
