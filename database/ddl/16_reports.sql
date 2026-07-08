/* =========================================================
   16. 신고 테이블: reports
   회원 신고 및 상품 신고 정보를 관리
   ========================================================= */
CREATE TABLE reports (
    report_id NUMBER NOT NULL,
    reporter_id NUMBER NOT NULL,
    reported_user_id NUMBER NOT NULL,
    report_type VARCHAR2(30) NOT NULL,
    product_id NUMBER,
    report_reason VARCHAR2(500) NOT NULL,
    report_status VARCHAR2(20) DEFAULT 'PENDING',
    created_at DATE DEFAULT SYSDATE,

    CONSTRAINT pk_reports PRIMARY KEY (report_id),

    CONSTRAINT fk_reports_reporter
        FOREIGN KEY (reporter_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_reports_reported_user
        FOREIGN KEY (reported_user_id)
        REFERENCES users(user_id),

    CONSTRAINT fk_reports_product_id
        FOREIGN KEY (product_id)
        REFERENCES products(product_id)
);
