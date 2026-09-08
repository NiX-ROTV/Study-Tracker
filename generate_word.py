from docx import Document
from docx.shared import Pt, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH

doc = Document()

# Header
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
run = p.add_run('UNIVERSITATEA "ȘTEFAN CEL MARE" DIN SUCEAVA\nFACULTATEA DE INGINERIE ELECTRICĂ ȘI ȘTIINȚA CALCULATOARELOR (FIESC)')
run.bold = True

p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
run_title = p_title.add_run('CAIET DE PRACTICĂ')
run_title.bold = True
run_title.font.size = Pt(16)

# Header Table
table_info = doc.add_table(rows=7, cols=2)
table_info.style = 'Table Grid'

data_info = [
    ('Student Practicant:', 'Tabără Nicholas (Anul II, Grupa 3121A)'),
    ('Domeniul / Specializarea:', 'Calculatoare / Inginerie Electrică și Calculatoare'),
    ('Organizația Gazdă (Compania):', 'TechUtil'),
    ('Departament / Punct de lucru:', 'Regim online'),
    ('Perioada Desfășurării:', '05 Iulie 2026 – 25 Iulie 2026'),
    ('Tutor de Practică (Companie):', 'Sergiu Ilciuc'),
    ('Cadru Didactic Îndrumător:', '')
]

for i, (key, value) in enumerate(data_info):
    row_cells = table_info.rows[i].cells
    row_cells[0].text = key
    row_cells[0].paragraphs[0].runs[0].bold = True
    row_cells[1].text = value

doc.add_paragraph()

# 1. Obiective
p_obj = doc.add_paragraph()
run_obj = p_obj.add_run('1. OBIECTIVELE STAGIULUI DE PRACTICĂ')
run_obj.bold = True

doc.add_paragraph('Stagiul de practică derulat în perioada 05.07.2026 - 25.07.2026 a vizat consolidarea cunoștințelor teoretice de inginerie software prin aplicarea lor practică: dezvoltarea de la zero a unei aplicații web Full-Stack utilizând stiva tehnologică MERN (MongoDB, Express.js, React.js, Node.js), integrarea de baze de date în cloud, autentificare securizată și publicarea proiectului (deployment).')

# 2. Jurnal
p_jur = doc.add_paragraph()
run_jur = p_jur.add_run('2. JURNALUL DETALIAT AL ACTIVITĂȚILOR ZILNICE')
run_jur.bold = True

table_jur = doc.add_table(rows=16, cols=3)
table_jur.style = 'Table Grid'

# Headers
hdr_cells = table_jur.rows[0].cells
hdr_cells[0].text = 'Data / Ziua'
hdr_cells[1].text = 'Task-uri Tehnic-Operative Desfășurate (2 per zi)'
hdr_cells[2].text = 'Ore'
for cell in hdr_cells:
    cell.paragraphs[0].runs[0].bold = True

tasks = [
    ("Luni\n06.07.2026", "• Analiza cerințelor și stabilirea arhitecturii aplicației web (MERN stack).\n• Configurarea mediului local de dezvoltare și a sistemului de versionare (Git)."),
    ("Marți\n07.07.2026", "• Proiectarea structurii bazei de date NoSQL.\n• Crearea clusterului în MongoDB Atlas și configurarea whitelist-ului IP."),
    ("Miercuri\n08.07.2026", "• Inițializarea backend-ului folosind Node.js și framework-ul Express.\n• Crearea schemelor de date folosind Mongoose (User, Subject, Schedule)."),
    ("Joi\n09.07.2026", "• Implementarea sistemului API de autentificare (Register/Login).\n• Securizarea parolelor cu bcrypt și generarea de token-uri JWT."),
    ("Vineri\n10.07.2026", "• Implementarea rutei pentru resetarea parolei (\"Forgot Password\").\n• Integrarea serviciului Nodemailer pentru trimiterea link-urilor de resetare securizate."),
    ("Luni\n13.07.2026", "• Crearea rutelor API RESTful pentru operațiuni CRUD pe materii.\n• Implementarea logicii backend pentru gestionarea sesiunilor de studiu din orar."),
    ("Marți\n14.07.2026", "• Inițializarea proiectului Frontend folosind React.js și Vite.\n• Configurarea framework-ului Tailwind CSS pentru stilizarea interfeței utilizator (UI)."),
    ("Miercuri\n15.07.2026", "• Implementarea sistemului de rutare Frontend folosind React Router.\n• Crearea structurii pentru paginile de bază: Login, Register și Reset Password."),
    ("Joi\n16.07.2026", "• Construirea layout-ului principal (Dashboard, TopBar, Navigation).\n• Gestionarea stării globale a aplicației folosind React hooks (useState, useEffect)."),
    ("Vineri\n17.07.2026", "• Conectarea formularelor de autentificare din Frontend la API-ul Backend.\n• Tratarea erorilor HTTP și afișarea notificărilor interactive (Toasts) către utilizator."),
    ("Luni\n20.07.2026", "• Dezvoltarea interfeței vizuale pentru Orar (grid interactiv pe zile).\n• Crearea logicii pentru adăugarea, editarea și ștergerea ferestrelor modale cu sloturi orare."),
    ("Marți\n21.07.2026", "• Dezvoltarea modulului dedicat pentru gestionarea materiilor și notițelor.\n• Validarea pe partea de client a datelor introduse de utilizator."),
    ("Miercuri\n22.07.2026", "• Integrarea completă Frontend-Backend și rezolvarea politicilor de securitate CORS.\n• Realizarea apelurilor asincrone către server folosind fetch API."),
    ("Joi\n23.07.2026", "• Debugging, optimizarea codului și tratarea cazurilor particulare (edge-cases).\n• Corectarea problemelor de encoding și afișare (reparare caractere UTF-8/diacritice)."),
    ("Vineri\n24.07.2026", "• Configurarea variabilelor de mediu pentru mediul de producție.\n• Deployment-ul aplicației complete (Backend și Frontend) pe platforma cloud Render.")
]

for i, (ziua, task) in enumerate(tasks):
    row_cells = table_jur.rows[i+1].cells
    row_cells[0].text = ziua
    row_cells[0].paragraphs[0].runs[0].bold = True
    row_cells[1].text = task
    row_cells[2].text = '6h'

doc.add_paragraph()

# 3. Proiect
p_pro = doc.add_paragraph()
run_pro = p_pro.add_run('3. PROIECT / ACTIVITATE PRINCIPALĂ')
run_pro.bold = True

p_prot = doc.add_paragraph()
run_prot1 = p_prot.add_run('Titlu: ')
run_prot1.bold = True
p_prot.add_run('Dezvoltarea aplicației web Full-Stack "Study Tracker" (Frontend React.js, Backend Node.js, Bază de date MongoDB Atlas).')

# 4. Concluzii
p_con = doc.add_paragraph()
run_con = p_con.add_run('4. CONCLUZII ȘI AUTOEVALUARE')
run_con.bold = True

doc.add_paragraph('Stagiul a permis aprofundarea cunoștințelor de programare asincronă, arhitectură client-server și managementul bazelor de date NoSQL. Am dobândit experiență practică solidă în dezvoltarea de API-uri securizate, versionarea codului (Git) și publicarea aplicațiilor în medii cloud de producție (Render).')

doc.add_page_break()

# 5. Avizare
p_avz = doc.add_paragraph()
run_avz = p_avz.add_run('5. AVIZAREA STAGIULUI DE PRACTICĂ')
run_avz.bold = True

table_avz = doc.add_table(rows=1, cols=2)
cell_left = table_avz.rows[0].cells[0]
cell_left.add_paragraph('Student Practicant:').runs[0].bold = True
cell_left.add_paragraph('Nume: Tabără Nicholas')
cell_left.add_paragraph('Semnătura: ___________________')
cell_left.add_paragraph('Data: ____/____/2026')

cell_right = table_avz.rows[0].cells[1]
cell_right.add_paragraph('Tutor de Practică (Companie):').runs[0].bold = True
cell_right.add_paragraph('Nume: Sergiu Ilciuc')
cell_right.add_paragraph('Calificativ / Notă: ___________________')
cell_right.add_paragraph('Semnătura & Ștampila: ___________________')
cell_right.add_paragraph('Data: ____/____/2026')

doc.save(r'd:\Practica\Proiectul I\Caiet_Practica_Tabara_Nicholas.docx')
print('Document saved to working directory')
