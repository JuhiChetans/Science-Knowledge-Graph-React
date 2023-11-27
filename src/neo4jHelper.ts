import { Driver, Session } from "neo4j-driver";
import * as neo4j from "neo4j-driver";
import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USER } from "./neo4j.config";

const driver: Driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD));

export const runQuery = async(query:string) => {
    const session: Session = driver.session();
    try {
        const result = await session.run(query);
        return result.records;
    } catch(error){
        console.error("Error running query ", error);
        return [];
    } finally {
        session.close();
    }
} 