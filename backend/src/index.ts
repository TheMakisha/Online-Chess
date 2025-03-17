import { AppDataSource } from "./data-source"
import { User } from "./entity/User"

AppDataSource.initialize().catch(err => console.log(err));
