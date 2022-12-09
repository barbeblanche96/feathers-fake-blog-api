import { app } from './src/app.js'

// Load our database connection info from the app configuration
const config = app.get('sqlite')

export default config
