import dotenv from 'dotenv'
if (process.env.NODE_ENV === 'test') dotenv.config({ path: '.env.test' })
else dotenv.config()
