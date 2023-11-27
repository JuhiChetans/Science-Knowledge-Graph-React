import {driver, Driver, auth, AuthToken} from 'neo4j-driver';
import * as DB from './neo4j.config';

const neo4jDriver: Driver = driver(DB.NEO4J_URI, auth.basic(DB.NEO4J_USER, DB.NEO4J_PASSWORD));

export default neo4jDriver;
