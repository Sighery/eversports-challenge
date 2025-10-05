import { Membership } from "../models/membershipModel";

export interface MembershipsRepository {
  getAll(): Promise<Membership[]>;
  getCount(): Promise<number>;
  save(newModel: Membership): Promise<Membership>;
}
