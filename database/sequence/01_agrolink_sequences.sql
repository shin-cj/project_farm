/* =========================================================
   농부링크(AgroLink) PK 자동번호용 시퀀스 생성 SQL
   Oracle Database / DBeaver 기준

   실행 대상: 시퀀스가 없는 새 스키마
   실행 순서: ddl/01_agrolink_schema.sql 실행 후 이 파일 실행
   참고: roles는 고정 권한 번호를 사용하므로 roles_seq를 만들지 않는다.
   ========================================================= */

CREATE SEQUENCE users_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE categories_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE farms_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE products_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE carts_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE cart_items_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE orders_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE order_items_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE payments_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE deliveries_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE qna_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE reviews_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE market_prices_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE chatbot_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

CREATE SEQUENCE reports_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE;
