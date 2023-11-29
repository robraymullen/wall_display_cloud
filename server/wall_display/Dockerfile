FROM rust:1.66.0 as builder

WORKDIR /usr/wall_display/
COPY ./ /usr/wall_display/

RUN cargo build --release

FROM debian:bullseye

WORKDIR /usr/local/bin
RUN apt-get update && apt-get install -y ca-certificates
COPY --from=builder /usr/wall_display/target/release/wall_display /usr/local/bin
COPY ./client_secret.json /usr/local/bin
COPY ./tokencache.json /usr/local/bin

EXPOSE 9090

CMD ["/usr/local/bin/wall_display"]