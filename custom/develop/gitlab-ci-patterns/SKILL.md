---
name: gitlab-ci-patterns
description: "Build GitLab CI/CD pipelines with multi-stage workflows, caching, and distributed runners for scalable automation."
---

# GitLab CI Patterns

Comprehensive GitLab CI/CD pipeline patterns for automated testing, building, and deployment.

## Pipeline Templates

Choose the appropriate reference based on your infrastructure:

- **Docker Patterns**: Building and pushing container images.
  - Read [references/DOCKER.md](references/DOCKER.md).
- **Terraform Patterns**: Automated IaC workflows.
  - Read [references/TERRAFORM.md](references/TERRAFORM.md).
- **Security & Optimization**: SAST, Dependency scanning, and caching.
  - Read [references/PIPELINE_OPTS.md](references/PIPELINE_OPTS.md).

---
## Best Practices
1. **Specific Tags**: Use `node:20`, not `latest`.
2. **Manual Gates**: Implement `when: manual` for production applies.
3. **Artifacts**: Use `artifacts` for build outputs and coverage reports.
