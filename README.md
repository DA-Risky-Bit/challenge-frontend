# Risky Bit Challenge Frontend
> Diploma 2026/27

Challenge frontend of the RiskyBit project, made as the practical part of the team's diploma.


## Description
The challenge interface for [RiskyBit](https://github.com/DA-Risky-Bit/RiskyBit), a software collection in Docker that provides an environment for hacking challenges for companies and schools. It lets participants <browse challenges, submit flags, view the scoreboard>. Built with React Router, TypeScript and TailwindCSS.

## Installation
This frontend is part of the RiskyBit compose setup. For a normal installation, use the [main repository](https://github.com/DA-Risky-Bit/RiskyBit) instead.

### Local development

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production build

```bash
npm run build
```

### Docker

```bash
docker build -t riskybit-challenge-frontend .
docker run -p 3000:3000 riskybit-challenge-frontend
```

## License
This project is licensed under MIT, specifics in:
[License](LICENSE)

## Contact
**Main Contact:** [contact@riskybit.com](mailto:contact@riskybit.com)

Team:
- **Valerian Hobel** – @htl3r-2135 [valerian.hobel@htl.rennweg.at](mailto:valerian.hobel@htl.rennweg.at)
- **Christoph Neumayer** – @ItzVoxel [christoph.neumayer@htl.rennweg.at](mailto:christoph.neumayer@htl.rennweg.at)
- **Gabriel Berger** – @htl3r-2129 [gabriel.berger@htl.rennweg.at](mailto:gabriel.berger@htl.rennweg.at)
- **Alexander Reiter** – @Sunnickel [alexander.reiter@htl.rennweg.at](mailto:alexander.reiter@htl.rennweg.at)
