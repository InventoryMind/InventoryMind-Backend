--


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: RequestRespond(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public."RequestRespond"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
IF NEW.state=1 THEN
 INSERT INTO normal_borrowing(request_id,state) VALUES (NEW.request_id,0);
END IF;
RETURN null;
END;
$$;


ALTER FUNCTION public."RequestRespond"() OWNER TO postgres;

--
-- Name: borrowTemporary(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public."borrowTemporary"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE equipment SET state='2' WHERE eq_id=NEW.eq_id;
return null;
END;
$$;


ALTER FUNCTION public."borrowTemporary"() OWNER TO postgres;

--
-- Name: requestedToBorrow(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public."requestedToBorrow"() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
UPDATE equipment SET state='1' WHERE eq_id=NEW.eq_id;
return null;
END;
$$;


ALTER FUNCTION public."requestedToBorrow"() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: administrator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administrator (
    user_id character varying(10) NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(100) NOT NULL,
    contact_no character varying(10) NOT NULL,
    is_active boolean
);


ALTER TABLE public.administrator OWNER TO postgres;

--
-- Name: assigned_t_o; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.assigned_t_o (
    t_o_id character varying(10) NOT NULL,
    lab_id character varying(3) NOT NULL
);


ALTER TABLE public.assigned_t_o OWNER TO postgres;

--
-- Name: equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment (
    eq_id character varying(8) NOT NULL,
    lab_id character varying(3) NOT NULL,
    name character varying(30) NOT NULL,
    type_id character varying(5) NOT NULL,
    added_date date NOT NULL,
    state smallint NOT NULL,
    condition text NOT NULL
);


ALTER TABLE public.equipment OWNER TO postgres;

--
-- Name: normal_borrowing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.normal_borrowing (
    borrow_id integer NOT NULL,
    request_id character varying(10) NOT NULL,
    state smallint NOT NULL
);


ALTER TABLE public.normal_borrowing OWNER TO postgres;

--
-- Name: request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.request (
    request_id character varying(10) NOT NULL,
    student_id character varying(10) NOT NULL,
    lecturer_id character varying(10) NOT NULL,
    date_of_borrowing date NOT NULL,
    date_of_returning date NOT NULL,
    reason text NOT NULL,
    state smallint NOT NULL
);


ALTER TABLE public.request OWNER TO postgres;

--
-- Name: requested_equipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requested_equipments (
    request_id character varying(10) NOT NULL,
    eq_id character varying(8) NOT NULL
);


ALTER TABLE public.requested_equipments OWNER TO postgres;

--
-- Name: temporary_borrowed_equipments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temporary_borrowed_equipments (
    borrow_id integer NOT NULL,
    eq_id character varying(8) NOT NULL
);


ALTER TABLE public.temporary_borrowed_equipments OWNER TO postgres;

--
-- Name: temporary_borrowing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.temporary_borrowing (
    borrow_id integer NOT NULL,
    student_id character varying(10) NOT NULL,
    date_of_borrowing date NOT NULL,
    reason text NOT NULL,
    state smallint NOT NULL
);


ALTER TABLE public.temporary_borrowing OWNER TO postgres;

--
-- Name: borrowed_items; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.borrowed_items AS
 SELECT temporary_borrowed_equipments.eq_id,
    equipment.name,
    temporary_borrowing.borrow_id,
    temporary_borrowing.student_id,
    equipment.lab_id,
    temporary_borrowing.date_of_borrowing,
    ((temporary_borrowing.date_of_borrowing + '1 day'::interval))::date AS date_of_returning,
    temporary_borrowing.reason,
    equipment.condition,
    'Temporary'::text AS borrow
   FROM ((public.temporary_borrowing
     JOIN public.temporary_borrowed_equipments USING (borrow_id))
     JOIN public.equipment USING (eq_id))
  WHERE (temporary_borrowing.state = 0)
UNION
 SELECT requested_equipments.eq_id,
    equipment.name,
    normal_borrowing.borrow_id,
    request.student_id,
    equipment.lab_id,
    request.date_of_borrowing,
    request.date_of_returning,
    request.reason,
    equipment.condition,
    'Normal'::text AS borrow
   FROM (((public.request
     JOIN public.requested_equipments USING (request_id))
     JOIN public.normal_borrowing USING (request_id))
     JOIN public.equipment USING (eq_id))
  WHERE (normal_borrowing.state = 0)
  WITH NO DATA;


ALTER TABLE public.borrowed_items OWNER TO postgres;

--
-- Name: building; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.building (
    b_id character varying(3) NOT NULL,
    b_name character varying(20) NOT NULL
);


ALTER TABLE public.building OWNER TO postgres;

--
-- Name: email; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email (
    msg_id integer NOT NULL,
    message text NOT NULL,
    recipient_id character varying(10) NOT NULL
);


ALTER TABLE public.email OWNER TO postgres;

--
-- Name: equipment_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.equipment_type (
    type_id character varying(8) NOT NULL,
    type character varying(20) NOT NULL,
    brand character varying(20) NOT NULL
);


ALTER TABLE public.equipment_type OWNER TO postgres;

--
-- Name: laboratory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.laboratory (
    lab_id character varying(3) NOT NULL,
    name character varying(30) NOT NULL,
    b_id character varying(3) NOT NULL,
    floor smallint NOT NULL,
    is_active boolean
);


ALTER TABLE public.laboratory OWNER TO postgres;

--
-- Name: lecturer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lecturer (
    user_id character varying(10) NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(100) NOT NULL,
    contact_no character varying(10) NOT NULL,
    is_active boolean
);


ALTER TABLE public.lecturer OWNER TO postgres;

--
-- Name: normal_borrowing_borrow_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.normal_borrowing_borrow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.normal_borrowing_borrow_id_seq OWNER TO postgres;

--
-- Name: normal_borrowing_borrow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.normal_borrowing_borrow_id_seq OWNED BY public.normal_borrowing.borrow_id;


--
-- Name: report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report (
    report_id integer NOT NULL,
    content text NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.report OWNER TO postgres;

--
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    user_id character varying(10) NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(100) NOT NULL,
    contact_no character varying(10) NOT NULL,
    is_active boolean
);


ALTER TABLE public.student OWNER TO postgres;

--
-- Name: technical_officer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.technical_officer (
    user_id character varying(10) NOT NULL,
    first_name character varying(20) NOT NULL,
    last_name character varying(20) NOT NULL,
    email character varying(30) NOT NULL,
    password character varying(100) NOT NULL,
    contact_no character varying(10) NOT NULL,
    is_active boolean
);


ALTER TABLE public.technical_officer OWNER TO postgres;

--
-- Name: verification_code; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_code (
    id integer NOT NULL,
    email character varying(50) NOT NULL,
    verification_code character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    is_used boolean DEFAULT false,
    user_type character varying(20) NOT NULL
);


ALTER TABLE public.verification_code OWNER TO postgres;

--
-- Name: verification_code_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verification_code_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.verification_code_id_seq OWNER TO postgres;

--
-- Name: verification_code_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verification_code_id_seq OWNED BY public.verification_code.id;


--
-- Name: whatsapp_msg; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.whatsapp_msg (
    msg_id integer NOT NULL,
    message text NOT NULL,
    recipient_id character varying(10) NOT NULL
);


ALTER TABLE public.whatsapp_msg OWNER TO postgres;

--
-- Name: normal_borrowing borrow_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_borrowing ALTER COLUMN borrow_id SET DEFAULT nextval('public.normal_borrowing_borrow_id_seq'::regclass);


--
-- Name: verification_code id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_code ALTER COLUMN id SET DEFAULT nextval('public.verification_code_id_seq'::regclass);







--
-- Name: normal_borrowing_borrow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.normal_borrowing_borrow_id_seq', 1, true);


--
-- Name: verification_code_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verification_code_id_seq', 1, false);


--
-- Name: administrator administrator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administrator
    ADD CONSTRAINT administrator_pkey PRIMARY KEY (user_id);


--
-- Name: assigned_t_o assigned_t_o_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_t_o
    ADD CONSTRAINT assigned_t_o_pkey PRIMARY KEY (t_o_id);


--
-- Name: building building_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_pkey PRIMARY KEY (b_id);


--
-- Name: email email_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email
    ADD CONSTRAINT email_pkey PRIMARY KEY (msg_id);


--
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (eq_id);


--
-- Name: equipment_type equipment_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment_type
    ADD CONSTRAINT equipment_type_pkey PRIMARY KEY (type_id);


--
-- Name: laboratory laboratory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory
    ADD CONSTRAINT laboratory_pkey PRIMARY KEY (lab_id);


--
-- Name: lecturer lecturer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lecturer
    ADD CONSTRAINT lecturer_pkey PRIMARY KEY (user_id);


--
-- Name: normal_borrowing normal_borrowing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_borrowing
    ADD CONSTRAINT normal_borrowing_pkey PRIMARY KEY (borrow_id);


--
-- Name: normal_borrowing normal_borrowing_request_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_borrowing
    ADD CONSTRAINT normal_borrowing_request_id_key UNIQUE (request_id);


--
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (report_id);


--
-- Name: request request_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (request_id);


--
-- Name: requested_equipments requested_equipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requested_equipments
    ADD CONSTRAINT requested_equipments_pkey PRIMARY KEY (request_id, eq_id);


--
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (user_id);


--
-- Name: technical_officer technical_officer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.technical_officer
    ADD CONSTRAINT technical_officer_pkey PRIMARY KEY (user_id);


--
-- Name: temporary_borrowed_equipments temporary_borrowed_equipments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporary_borrowed_equipments
    ADD CONSTRAINT temporary_borrowed_equipments_pkey PRIMARY KEY (borrow_id, eq_id);


--
-- Name: temporary_borrowing temporary_borrowing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporary_borrowing
    ADD CONSTRAINT temporary_borrowing_pkey PRIMARY KEY (borrow_id);


--
-- Name: verification_code verification_code_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_code
    ADD CONSTRAINT verification_code_pkey PRIMARY KEY (id);


--
-- Name: whatsapp_msg whatsapp_msg_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.whatsapp_msg
    ADD CONSTRAINT whatsapp_msg_pkey PRIMARY KEY (msg_id);


--
-- Name: request Approve; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "Approve" AFTER UPDATE ON public.request FOR EACH ROW EXECUTE FUNCTION public."RequestRespond"();


--
-- Name: temporary_borrowed_equipments borrowTemporary; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "borrowTemporary" AFTER INSERT ON public.temporary_borrowed_equipments FOR EACH ROW EXECUTE FUNCTION public."borrowTemporary"();


--
-- Name: requested_equipments requestedToBorrow; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER "requestedToBorrow" AFTER INSERT ON public.requested_equipments FOR EACH ROW EXECUTE FUNCTION public."requestedToBorrow"();


--
-- Name: assigned_t_o assigned_t_o_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_t_o
    ADD CONSTRAINT assigned_t_o_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.laboratory(lab_id);


--
-- Name: assigned_t_o assigned_t_o_t_o_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.assigned_t_o
    ADD CONSTRAINT assigned_t_o_t_o_id_fkey FOREIGN KEY (t_o_id) REFERENCES public.technical_officer(user_id);


--
-- Name: email email_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email
    ADD CONSTRAINT email_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.student(user_id);


--
-- Name: email email_recipient_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email
    ADD CONSTRAINT email_recipient_id_fkey1 FOREIGN KEY (recipient_id) REFERENCES public.lecturer(user_id);


--
-- Name: equipment equipment_lab_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_lab_id_fkey FOREIGN KEY (lab_id) REFERENCES public.laboratory(lab_id);


--
-- Name: equipment equipment_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.equipment_type(type_id);


--
-- Name: laboratory laboratory_b_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.laboratory
    ADD CONSTRAINT laboratory_b_id_fkey FOREIGN KEY (b_id) REFERENCES public.building(b_id);


--
-- Name: normal_borrowing normal_borrowing_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.normal_borrowing
    ADD CONSTRAINT normal_borrowing_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.request(request_id);


--
-- Name: request request_lecturer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_lecturer_id_fkey FOREIGN KEY (lecturer_id) REFERENCES public.lecturer(user_id);


--
-- Name: request request_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(user_id);


--
-- Name: requested_equipments requested_equipments_eq_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requested_equipments
    ADD CONSTRAINT requested_equipments_eq_id_fkey FOREIGN KEY (eq_id) REFERENCES public.equipment(eq_id);


--
-- Name: requested_equipments requested_equipments_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requested_equipments
    ADD CONSTRAINT requested_equipments_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.request(request_id);


--
-- Name: temporary_borrowed_equipments temporary_borrowed_equipments_borrow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporary_borrowed_equipments
    ADD CONSTRAINT temporary_borrowed_equipments_borrow_id_fkey FOREIGN KEY (borrow_id) REFERENCES public.temporary_borrowing(borrow_id);


--
-- Name: temporary_borrowed_equipments temporary_borrowed_equipments_eq_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporary_borrowed_equipments
    ADD CONSTRAINT temporary_borrowed_equipments_eq_id_fkey FOREIGN KEY (eq_id) REFERENCES public.equipment(eq_id);


--
-- Name: temporary_borrowing temporary_borrowing_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.temporary_borrowing
    ADD CONSTRAINT temporary_borrowing_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(user_id);


--
-- Name: whatsapp_msg whatsapp_msg_recipient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.whatsapp_msg
    ADD CONSTRAINT whatsapp_msg_recipient_id_fkey FOREIGN KEY (recipient_id) REFERENCES public.student(user_id);


--
-- Name: whatsapp_msg whatsapp_msg_recipient_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.whatsapp_msg
    ADD CONSTRAINT whatsapp_msg_recipient_id_fkey1 FOREIGN KEY (recipient_id) REFERENCES public.lecturer(user_id);


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO postgres;


--
-- Name: borrowed_items; Type: MATERIALIZED VIEW DATA; Schema: public; Owner: postgres
--

REFRESH MATERIALIZED VIEW public.borrowed_items;


--
-- PostgreSQL database dump complete
--

