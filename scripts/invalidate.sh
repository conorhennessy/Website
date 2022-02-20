#!/usr/bin/env bash

# Invalidate site's cloudfront distribution

CLOUDFRONT_DISTRIBUTION=$CLOUDFRONT_DISTRIBUTION_ID

aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION} --paths '/*'
