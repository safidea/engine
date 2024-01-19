export default async function ({ email, input }) {
  const { to, from, subject, body } = input;
  await email.send({ from, to, subject, body });
}
