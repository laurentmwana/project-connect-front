import { AuthenticatedUser } from "./auth";
import { Skill } from "./project";

export interface Portfolio {
   id: number,
    name: string,
    description: string,
    link : string,
    skills: Skill[],
    user: AuthenticatedUser
}

export interface PortofolioExamplePoOComprendre{
    
}
