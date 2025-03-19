--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: items; Type: TABLE; Schema: public; Owner: express_wiellona_owner
--

CREATE TABLE public.items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    price integer NOT NULL,
    store_id uuid NOT NULL,
    image_url character varying(255),
    stock integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.items OWNER TO express_wiellona_owner;

--
-- Name: stores; Type: TABLE; Schema: public; Owner: express_wiellona_owner
--

CREATE TABLE public.stores (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stores OWNER TO express_wiellona_owner;

--
-- Name: users; Type: TABLE; Schema: public; Owner: express_wiellona_owner
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    balance integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO express_wiellona_owner;

--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: express_wiellona_owner
--

COPY public.items (id, name, price, store_id, image_url, stock, created_at) FROM stdin;
3b2fe83d-ab88-4f65-b4b3-70905793e9af	lanyard 2	104000	862991d6-0f01-4e28-b3a7-a6f46320b598	https://res.cloudinary.com/drno8mzax/image/upload/v1742137993/a7zsra2pb4xbugnplwdw.jpg	5	2025-03-16 15:13:13.923671
\.


--
-- Data for Name: stores; Type: TABLE DATA; Schema: public; Owner: express_wiellona_owner
--

COPY public.stores (id, name, address, created_at) FROM stdin;
862991d6-0f01-4e28-b3a7-a6f46320b598	UI Store Engineering	Kota tercinta Depok, FTUI	2025-03-16 11:10:20.774293
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: express_wiellona_owner
--

COPY public.users (id, name, email, password, balance, created_at) FROM stdin;
9758e642-f722-487a-879a-aaf96e6fa5c7	Edgrant	env@jangan.public.ya	$2b$10$1MSfySGXlU9r79cOGpNCLuUgXx9OrQ3cdJi4AgzpzMMy5VkSoLLxu	0	2025-03-13 08:53:40.338952
\.


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: express_wiellona_owner
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: stores stores_pkey; Type: CONSTRAINT; Schema: public; Owner: express_wiellona_owner
--

ALTER TABLE ONLY public.stores
    ADD CONSTRAINT stores_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: express_wiellona_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: express_wiellona_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: items items_store_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: express_wiellona_owner
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

