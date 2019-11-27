import { SchemaService } from './schema.service';
import { ISchema, ISchemaResponse } from '../../../interfaces/schema.interface';

export class Schema {
  private _schemaSvc: SchemaService;
  constructor(_apiUrl: string) {
    this._schemaSvc = new SchemaService(_apiUrl);
  }

  // creates a schema and if none is created then it will return an error

  async createSchema(schema: ISchema): Promise<ISchemaResponse> {
    try {
      const res = await this._schemaSvc.postSchema(schema);

      // TODO: point to documentation on what to troubleshoot if the schema's not creating
      return res;
    } catch (err) {
      throw err.message;
    }
  }
  async getSchemaById(id: string) {
    try {
      const res = await this._schemaSvc.getSchemaById(id);
      return res;
    } catch (err) {}
  }
}
