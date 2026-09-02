# Provenance — skill-inspector

Vendored from NVIDIA SkillSpector. `SKILL.md` is an unmodified copy of the
upstream file; `LICENSE` is the upstream Apache License 2.0 it ships under.

| | |
|---|---|
| Upstream | https://github.com/NVIDIA/SkillSpector |
| Upstream location | the `skill-inspector` folder of that repo |
| Commit | `7805bb94843d91cb9937f57264ca52642164499b` |
| Commit date | 2026-08-31 |
| Vendored on | 2026-09-02 |
| License | Apache License 2.0 (see `LICENSE`) |

## Companion CLI

The skill calls a `skillspector` CLI for its static-analysis pass. That CLI is
a separate Python package and is **not** vendored here — installing it is a
per-machine step:

```bash
uv tool install 'skillspector @ git+https://github.com/NVIDIA/SkillSpector.git' --python 3.12
```

It needs Python 3.12–3.14; `--python 3.12` lets uv fetch a toolchain rather
than relying on the system Python.

Without the CLI the skill still runs — it drops the static scan, does a
source-only semantic review, and states that no SkillSpector scan ran.

## Updating

Re-copy `SKILL.md` and `LICENSE` from a newer upstream commit and update the
commit row above, so the vendored version is always traceable to a specific
upstream revision.
