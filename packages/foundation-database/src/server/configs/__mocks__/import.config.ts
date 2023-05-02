class PrismaClient {
  user = {}
}

const PrismaClients = {
  master: { PrismaClient },
}

function importConfig() {
  return { PrismaClients }
}

export default importConfig
