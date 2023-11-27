import { Session } from "neo4j-driver";
import neo4jDriver from "../neo4j";


export async function fetchGraphData() {
    const session: Session = neo4jDriver.session();

    try {
        const query: string = 'MATCH (n:Faculty)-[r:RESEARCHS_IN]->(m:Research_Field) WHERE n.faculty_name = "Jia Zhang" RETURN n,r,m';

        const result = await session.run(query);

        const nodes = new Set();
        const links = new Array();

        result.records.forEach((record) => {
            nodes.add(record.get("n"));
            nodes.add(record.get('m'))
            links.push(record.get("r"));
        });
         session.close();

        return {nodes: Array.from(nodes), links: links};
    } finally {
        await session.close();
    }
}