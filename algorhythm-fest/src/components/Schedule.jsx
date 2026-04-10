import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
// import StarBackground from "./StarBackground"
import RegistrationForm from "./RegistrationForm"


export const eventsDay1 = [
  {
    time: "10:30 AM",
    title: "ESCAPE ROOM",
    location: "Lab 3 & 4, 4th Floor,GCEM Campus",
    description: "This is a web-based technical escape room competition conducted in a controlled lab environment. Teams will solve a series of logical, programming, and cybersecurity-based challenges across four progressive levels. Each level contains multiple puzzles that must be solved to obtain a key and unlock the next stage.",
    category: "Tech",
    prize: "₹7,500",
    minTeamSize: 1,
    maxTeamSize: 3,
    rules: ["1. Participants must be currently enrolled students of their respective institutions.",
      "2. Each team must consist of 1 to 3 members. Individual participation is allowed.",
      "3. All participants must carry a valid college ID card for verification.",
      "4. The event will be conducted on lab computers provided by the organizers. Use of personal laptops is strictly prohibited.",
      "5. The competition will run for a total duration of 3 hours, and teams must adhere strictly to the time limits.",
      "6. Participants will access the platform through a secured browser environment. Switching tabs, accessing external websites, or attempting to bypass system restrictions will result in penalties or disqualification.",
      "7. Mobile phones, smart devices, and any external storage devices are not permitted during the event. Participants may be asked to keep their phones aside before the competition begins.",
      "8. Teams must solve the challenges sequentially. A level must be completed to unlock the next level.",
      "9. A “Hint” option will be available. Using a hint will result in a time and points penalty as specified during the event.",
      "10. The leaderboard and scoring will be managed automatically by the system. The decision of the organizing team regarding scoring, eliminations, and final results will be final and binding.",
      "11. Eliminations will occur after designated levels based on performance.",
      "12. Any attempt to tamper with the system, share answers, or engage in unfair practices will lead to immediate disqualification.",
      "13. Specific instructions and login credentials will be provided at the venue before the event begins.",
      "14. Prizes will be awarded based on final rankings.",
      "15. Please check the event schedule before registering multiple events. Participants are responsible for checking the event schedule. The MANAGEMENT is not responsible for clashes with other events, and no refund will be provided in case of overlap.The participants from Gopalan Group of Institutions should contact the respective event coordinator before registering",
      "16. Report to the coordinator 30 minutes before the event starts.",
      "17.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",],
    coordinators: ["Jyesht M – 8951323830",
      "Vivek Kashyap – 8850623515",
      "Thanishka Reddy – 9449119449"],
    registerLink: "#",
    fee: "₹300",
  },
  {
    time: "10:30 AM",
    title: "CHESS",
    location: "Seminar Hall, 1st Floor,GCEM Campus",
    description: "The tournament will follow standard FIDE chess rules, starting with 3 Swiss rounds where players earn points for wins and draws to determine rankings.",
    category: "Fun",
    prize: "₹8,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["*GAME RULES ARE SAME AS FIDE TOURNAMENTS*",
      "1. Tournament Format: The tournament will follow the Swiss System for 3 rounds. After the Swiss rounds, the Top 16 players will qualify for the Knockout stage.",

      "2. Rounds: All players will play 3 Swiss rounds. Pairings will be announced before each round.",

      "3. Scoring System:",
      "Win = 1 point",
      "Draw = 0.5 point",
      "Loss = 0 point",

      "4. Qualification: After 3 rounds, players will be ranked based on total points and tie-breaks. The Top 16 players will advance to knockouts.",

      "5. Knockout Stage: The knockout rounds will be played as Round of 16 → Quarterfinal → Semifinal → Final.",

      "6. Time Control: Each game will be played in Rapid format (7 minutes per player for Swiss rounds and 10 minutes per player for Knockout rounds).",

      "7. Touch-Move Rule: If a player touches a piece intentionally, that piece must be moved if a legal move exists.",

      "8. Illegal Moves: Two illegal moves by a player will result in the loss of the game.",

      "9. Fair Play: Mobile phones and electronic devices are not allowed in the playing area.",

      "10. Authority & ID: The arbiter’s decision will be final, and players must carry their college ID cards.",
      "11. Please check the schedule for overlapping events before registering for multiple events.",
      "12. If you have registered for overlapping events, management will not be responsible and no refund will be initiated. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "13. Participants must report to the coordinator 30 minutes before the event starts.",
      "14.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Saravanan M – 8618648916", "Nithesh – 8431648766"],
    registerLink: "#",
    fee: "₹250"
  },
  {
    time: "10:30 AM",
    title: "HIGHLIGHT REEL",
    location: "410 Room, 4th Floor,GCEM Campus",
    description: "This event will require the participants to take photos and/or videos of the event happening on the day They are then required to compile these photos and/or videos into a single edited video of a span of max 2 mins. These videos will be evaluated by the jury and the winners will be announced.The participants will need to cover the event on both the days.",
    category: "Fun",
    prize: "₹7,500",
    comboPass: "₹450 (HIGHLIGHT REEL + SHOT CUT)",
    minTeamSize: 2,
    maxTeamSize: 3,
    rules: ["1. Participants must be currently enrolled in their college.",
      "2.  Participants must bring a valid college ID card.",
      "3.The participants should not misbehave during the event. If caught misbehaving, it might lead to disqualification.",
      "4.The videos submitted must not include any watermarks or logos. ",
      "5.The video must not include any kind of slander towards the institution.",
      "6.Specific instructions about the video will be briefed to the teams before the start of the event.",
      "7.Participants have to bring their own equipment (camera, phone, laptop), as they will not be provided by the college.",
      "8. Participation as a group of 3(Min=2, Max=3)",
      "9. The originality of the edit will be verified by reviewing the project timeline/history in the editing software used by the participants.",
      "10. Please check the schedule for overlapping events before registering  multiple events",
      "11. If you have registered for overlapping events, management is not responsible, no refund will be initiated. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "12. Report to the coordinator 30 minutes before the event starts.",
      "13.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",],
    coordinators: ["Abdul Shuaib – 7892698624", "Veeresh Viraktamath – 9380022929"],
    registerLink: "#",
    fee: "₹300",
  },
  {
    time: "11:30 AM",
    title: "CAMPUS CARNAGE",
    location: "Room 405,406 & 407, 4th Floor, GCEM Campus",
    description: "The BGMI Tournament is a competitive esports event where teams battle in custom lobby matches to showcase their strategy, coordination, and combat skills.",
    category: "Fun",
    prize: "₹12,000",
    minTeamSize: 4,
    maxTeamSize: 4,
    rules: ["All participants should arrive at the venue 30 min prior to the event.", "1. Participants must be currently enrolled students of their respective institutions.",

      "2.  All participants must carry a valid college ID card for verification.",

      "3.  Each team must consist of 4 players only. No substitute players are allowed.",

      "4.  All players must have a BGMI account above Level 25, and the account must be at least 30 days old.",

      "5.  Only Android and iOS smartphones are permitted. Tablets, iPads, and emulators are strictly prohibited.",

      "6.  The tournament will consist of 4 matches in total. The maps for each match will be randomly selected, so all players must download all BGMI maps before the tournament.",

      "7.  Points will be awarded as follows:",

      "  #1 – 15 Points",

      "  #2 – 12 Points",

      "  #3 – 10 Points",

      "  #4 – 8 Points",

      "  #5 – 6 Points",

      "  #6 – 4 Points",

      "  #7 – 2 Points",

      "8. Each Kill – 1 Point",

      "9.  The total points from all 4 matches will determine the final rankings and winners.",

      "10.  Teams must join the custom room within the given time. A maximum waiting time of 5 minutes will be provided. If a team fails to join before match start, the match will continue without them and no rematch will be given.",

      "11.  WiFi will be provided by the organizers. However, players are strongly advised to keep their own mobile data as backup. No rematch will be given for network issues, lag, or disconnections.",
      "12. Use the Internet to join the matches, after joining connect to the provided wifi to avoid any joining issues.",

      "13.  All participants must take full responsibility for their personal belongings, including devices and accessories. The organizers shall not be liable for any loss, theft, or damage during the event.",

      "14.  All required maps must be downloaded before the tournament. Matches will not be delayed for map downloads.",

      "15.  Participants are requested to bring a power bank for backup, if possible, to avoid interruptions during the tournament.",

      "16.  Teams must report 30 minutes before match time for check-in and verification.",

      "17.  Any form of cheating, hacking, teaming, use of third-party tools, account sharing, or unfair practices will result in immediate disqualification.",

      "18. Any additional rules or instructions will be communicated to participants before the start of each match.",

      "19. Official observer records and organizer decisions will be final in case of any disputes.",
      "20. Please check the event schedule before registering multiple events. Participants are responsible for checking the event schedule. The MANAGEMENT is not responsible for clashes with other events, and no refund will be provided in case of overlap.The participants from Gopalan Group of Institutions should contact the respective event coordinator before registering",
      "21. Report to the coordinator 30 minutes before the event starts.",
      "22.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show)."],
    coordinators: ["Rajesh – 8073439040", "Pavan - 8073083421", "Darshan R- 7760055444"],
    registerLink: "#",
    fee: "₹600",
  },
  {
    time: "12:30 PM",
    title: "CANVISTA",
    location: "LAB 5, Ground Floor, GCEM Campus",
    description: "This is a Poster Designing event. It will consist of two rounds.The theme will be provided to the participants at the start of the event, and the poster must be made digitally within the set time limit using any software they wish to use.",
    category: "Fun",
    prize: "₹6,000",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["1. Participants must be currently enrolled in their college.",
      "2.  Participants must bring a valid college ID card.",
      "3.  Participants must bring their laptops with all necessary software pre-installed",
      "4.  Computers will be provided to participants who are not able to bring their laptops(only limited computers available). ",
      "5.  Internet access will be provided at the venue.",
      "6.  The theme of the poster will be announced at the start of the competition.",
      "7.  Specific instructions will be provided before the start of the event. ",
      "8.  Please check the schedule for overlapping events before registering for multiple events.",
      "9.  If you have registered for overlapping events, MANAGEMENT is not responsible, no refund will be initiated.10. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "11. Report to the coordinator 30 minutes before the event starts.",
      "12. Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",


    ],
    coordinators: ["Nithelan Jayakumar – 8904572607", "Bushra M – 8310084375"],
    registerLink: "#",
    fee: "₹200",
  },
  {
    time: "01:30 PM",
    title: "CODE SPRINT",
    location: "LAB 3, 4th Floor,GCEM Campus",
    description: "Test your coding and problem-solving skills in this competitive programming event conducted on HackerRank. Participants will compete through elimination rounds to solve challenging problems and prove their programming expertise.",
    category: "Tech",
    prize: "₹7,500",
    minTeamSize: 1,
    maxTeamSize: 2,
    rules: ["1. This event consists of two rounds that will be conducted on HackerRank.",

      "2. Participants may use any programming language.",

      "3. Every participant must have a HackerRank account.",

      "4. The first round consists of three questions and is an elimination round.",

      "5. The second round consists of two questions. ",

      "6. Participants must be current college students. A valid college ID card is required for participation.",

      "7. All phones and smartwatches must be surrendered at the start of the event and will be returned afterward. Failure to comply will result in immediate disqualification.",

      "8. There are 2 prizes if there are more than 11 registrations; otherwise, there will be only 1 prize.",

      "9. Any form of cheating, including internet access or the use of chatbots, will lead to instant disqualification. Volunteers will monitor for compliance. ",

      "10. Event-specific rules will be explained before the start of the event. ",

      "11. Please check the schedule for overlapping events before registering for multiple events. ",

      "12. If you have registered for overlapping events, MANAGEMENT is not responsible and no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering.",
      "13. Report to the coordinator 30 minutes before the event starts.",
      "14.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["M Tarun – 9663053076",
      "Bettina – 7619689937"
    ],
    registerLink: "#",
    fee: "₹350",
  },
  {
    time: "01:30 PM",
    title: "VINTARA",
    location: "GIS Auditorium",
    description: "The VINTARA is an exciting FASHION SHOW event where teams showcase their creativity, style, and confidence on the ramp. Participants will perform based on a specific theme within a 3–4 minute time limit. The event highlights coordination, originality, and stage presence while maintaining decency and discipline. It promises a vibrant and entertaining experience for both participants and the audience.",
    category: "Fun",
    prize: "₹12,000",
    minTeamSize: 5,
    maxTeamSize: 8,
    rules: ["1.	Each team must have 4-8 members.",
      "2.	Performance time limit: 3–4 minutes (strict).",
      "3.	Vulgarity or inappropriate content is strictly prohibited.",
      "4.	Teams must arrive and report to the coordinator at the venue 1 hour before event start time.",
      "5.	Judges decision will be final and binding.",
      "6.	Costumes must be decent and modest.",
      "7.	Excessive skin exposure is strictly prohibited.",
      "8.	Transparent or inappropriate outfits will lead to disqualification.",
      "9. No political, religiously sensitive, or controversial representations.",
      "10. No fire, water, smoke, powder, sharp objects, or hazardous props.",
      "11. Organizing committee reserves the right to disqualify any participant violating decorum.",
      "12. Please check the schedule for overlapping events before registering for multiple events.",
      "13. If you have registered for overlapping events, management is not responsible,any such situations no refund will be initiated.",
      "14. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      ".",
      "'MUSIC RULES'",
      "1.Submit via Google Drive/email 48 hours prior.",
      "2.File name format:  CollegeName_TeamName.mp3",
      "3.No obscene lyrics.",
      "4.No explicit content.",
      "5.Only one track allowed per entry.",
      "6.Backup pen drive mandatory.",
      "",],
    coordinators: ["Shreeka K - 8861619612", "Vishaka - 8431217851", "Yeshwanth - 8884359993"],
    registerLink: "#",
    fee: "₹800",
    theme: "OPEN THEME"
  },
]

export const eventsDay2 = [
  {
    time: "09:00 AM",
    title: "TRIPLE THREAT CHALLENGE",
    location: "Seminar Hall, 4th floor, GCEM Campus",
    description: "TRIPLE THREAT CHALLENGE is a team-based challenge event conducted. Each team consists of four members and will compete across three exciting rounds that test teamwork, coordination, communication, and speed.",
    category: "Fun",
    prize: "₹6,000",
    minTeamSize: 4,
    maxTeamSize: 4,
    rules: ["  1. Participants must be currently enrolled in their respective colleges.",
      "2. Each team must consist of 4 members.",
      "3. All participants must carry a valid college ID card.",
      "4. Teams must report to the  coordinator and arrive at the venue 15 minutes before the event begins.",
      "5. Participants must strictly follow the instructions given by the coordinators.",
      "6. Any form of misconduct or unfair practice will lead to disqualification.",
      "7. Registration fees once paid are non-refundable and non-transferable under any circumstances.",
      "8. The decision of the judges/coordinators will be final and binding.",
      "9. Please check the schedule for overlapping events before registering multiple events",
      "10. If you have registered for overlapping events, MANAGEMENT is not responsible,any such situations no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "11.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Himashree - 8885392795", "Pratiksha – 8867114450"],
    registerLink: "#",
    fee: "₹500"
  },
  {
    time: "09:30 AM",
    title: "THE WORD SYNDICATE",
    location: "105, 1st Floor, GCEM Campus",
    description: "This is an interactive and strategic word-based competition where teams participate in a simulated auction to bid for letters, words, or language-based challenges using fake currency. Teams must use their bidding strategy, vocabulary knowledge, and quick thinking to build valid words, solve linguistic puzzles, and earn points. The event encourages creativity, language skills, and decision-making while maintaining a competitive and engaging environment.",
    category: "Fun",
    prize: "₹3,500",
    minTeamSize: 1,
    maxTeamSize: 2,
    rules: ["1.	Participants must be currently enrolled students of their respective institutions.",
      "2.	Each team must consist of 1 to 2 members. Individual participation is allowed.",
      "3.	All participants must carry a valid college ID card for verification.",
      "4.	Each team will be provided with a fixed amount of fake currency at the beginning of the event for bidding purposes.",
      "5.	Letters, word fragments, or language challenges will be auctioned by the host during the event.",
      "6.	Teams must strategically bid to acquire letters or linguistic resources required to form meaningful words or solve challenges.",
      "7.	Bidding must follow the auction rules announced by the host. Once a bid is confirmed, it cannot be withdrawn.",
      "8.	Teams must construct valid words or complete linguistic tasks using the letters/resources they successfully win in the auction.",
      "9.	Only standard English dictionary words will be considered valid unless otherwise specified by the organizers.",
      "10. The judging panel will verify the validity of words and tasks completed. Their decision will be final and binding.",
      "11. Teams are not allowed to use mobile phones, smart devices, dictionaries, translation tools, or any external resources during the event.",
      "12. Any attempt to communicate answers with other teams, share resources, or engage in unfair practices will result in immediate disqualification.",
      "13. Points will be awarded based on word complexity, correctness, creativity, and task completion as defined by the event rules.",
      "14.  Please check the schedule for overlapping events before registering multiple events.",
      "15. Participants are responsible for checking the event schedule. The Management is not responsible for clashes with other events, and no refund will be provided in case of overlap. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "16. Report to the coordinator 30 minutes before the event starts.",
      "17.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Charan Kumar – 9482886761", "Vadla Chaturya - 9986070222"],
    registerLink: "#",
    fee: "₹200"
  },
  {
    time: "09:30 AM",
    title: "TECH DEBATE COMPETITION",
    location: "Room 107 & 108, 1st Floor, GCEM Campus",
    description: "A knockout-style technical debate competition focusing on emerging technologies like AI, Cybersecurity, Blockchain, Quantum Computing & Digital Ethics.",
    category: "Tech",
    prize: "₹6,000",
    minTeamSize: 2,
    maxTeamSize: 3,
    rules: ["1. Participants must carry valid college ID card.",
      "2. Teams must report 45 minutes before event start.",
      "3. Topic will be given 30 minutes prior to debate.",
      "4. FOR/AGAINST position decided by draw.",
      "5. No mobile phones allowed during debate.",
      "6. Participants can use Phone or Laptop only during preparation time.",
      "7. No offensive/personal remarks.",
      "8. Time limit strictly followed.",
      "9. Judges decision will be final.",
      "10. Please check the schedule for overlapping events before registering multiple events.",
      "11. Participants are responsible for checking the event schedule. The Management is not responsible for clashes with other events, and no refund will be provided in case of overlap. The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "12.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Prince Kumar – 7277402658",
      "Tarun Kumar Pathak – 8073165834"],
    registerLink: "#",
    fee: "₹300",
  },

  {
    time: "10:30 AM",
    title: "IGNITE THE BEAT",
    location: "GIS Auditorium",
    description: "Step into the spotlight and let your passion ignite the stage, where every move tells a story and every rhythm captivates the soul. Witness an electrifying showcase of talent, energy, and grace, as dancers compete to turn dreams into motion.",
    category: "Fun",
    prize: "₹12,000",
    minTeamSize: 2,
    maxTeamSize: 15,
    rules: ["*Duration: 6-8 minutes per team for their performance*",
      "All participants should arrive at the venue 1 hour prior to the event.",
      "1. Music",
      "• Teams must submit their music tracks in MP3 format via Google Drive/email by 07/03/2026.",
      "• File name format: College/Group Name.mp3",
      "• Backup copies of music tracks should be brought on USB drive.",
      "• Music should be appropriate and not contain any explicit content.",
      ".",
      "2. Choreography",
      "• All dance forms are allowed (Classical, Hip-hop, Semi-classical, Folk,Contemporary).",
      "• Choreography should be original or legally permissible.",
      ".",
      "3. Costumes",
      "• Costumes should be appropriate and respectful of cultural sensitivities.",
      "• Any form of obscenity will result in disqualification.",
      ".",
      "4. Props",
      "• Props are allowed but must be handled by participants themselves.",
      "• Dangerous/Problematic props (fire, sharp objects,powders etc) are prohibited.",
      ".",
      // "• There will be 2 prizes if more than 8 registrations; otherwise, only 1 prize",
      "5. Note",
      "• Please check the schedule for overlapping events before registering multiple events",
      "• If registered for overlapping events, MANAGEMENT is not responsible and no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "• Arrive at the venue and report to the coordinators 1 hour before the event starts",
      ".",
      "CODE OF CONDUCT",
      "• Participants are expected to maintain decorum and sportsmanship.",
      "• Any form of misbehavior or disrespect towards organizers, judges, or fellow will lead to disqualification.",
      "• Vulgar language, inappropriate gestures, and offensive content are strictly prohibited.",
      "• If technical issues occur, participants may be allowed to restart (subject to judges approval).",
      "• The decision of the judges is final and binding.",
      "• Performances are judged based on choreography, synchronization,expression, creativity, and overall impact.",
      ".",
      "SAFETY",
      "•Participants should ensure their performance is safe and does not pose any risk to themselves or the audience",
      "13.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",

    ],
    coordinators: ["Divyashree RM – 7019691887", "Abhishek R - 7019323085"],
    registerLink: "#",
    fee: "₹700",
  },
  {
    time: "10:30 AM",
    title: "SHOT CUT",
    location: "Room 410, 4th Floor, GCEM Campus",
    description: "Shot-Cut is a 9:16 / 16:9 reel advertising challenge where teams get 48 hours to turn a common theme into a powerful brand story. It’s not just about making a video — it’s about thinking creatively, understanding marketing strategy, and delivering strong visuals with convincing storytelling, all under pressure. Every second matters, and the final reel must be sharp, engaging, and impactful, with a duration of 60 seconds or less.",
    category: "Fun",
    prize: "₹7,500",
    minTeamSize: 2,
    maxTeamSize: 3,
    comboPass: "₹450 (SHOT CUT + HIGHLIGHT REEL)",
    rules: ["1. Participants must be currently enrolled in their college.",
      "2.  Participants must bring a valid college ID card.",
      "3. Team Size: Each team must consist 3 members.",
      "4. Theme Announcement: The common theme will be revealed on (09/04/2026 Morning).",
      "5. Teams will have time from the moment the theme is revealed until the official submission deadline to plan, shoot, and edit their advertisement.",
      "6. Work Mode: The advertisement must be shot and edited from Home/College. Participants must bring the fully edited final video on the event day.",
      "7. Video Format: The reel must be in 9:16 (vertical) or 16:9 (horizontal) format.",
      "8. Duration: The video must be 60 seconds or less.",
      "9. Originality: The ad must be completely original. Plagiarism or use of copyrighted material without permission will result in disqualification.(Eg:Clipping videos from youtube)",
      "10. Equipment & Software: Participants may use any camera device and any editing software.",
      "11. Presentation Round: Teams must present their advertisement in front of the judges, explaining their concept, strategy, and execution.",
      "12. Submission Deadline will be before the event starts on (11/04/2026-Saturday)",
      "13. Judging Criteria:",
      "Hook & First 3 Seconds Impact",
      "Ad Concept & Originality",
      "Brand/Product Integration",
      "Message Clarity & Communication",
      "Editing, Pacing & Video Optimization",
      "Marketing Effectiveness & Call-to-Action",
      "Presentation",
      ".",
      "14. Judges Decision: The judges decision will be final.",
      "15. Please check the schedule for overlapping events before registering multiple events",
      "16. If you have registered for overlapping events, MANAGEMENT is not responsible, no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "17. Report to the coordinators 30 minutes before the event starts",
      "18.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["Abhishek Mannatharaj - 7483076739", "Veeresh Viraktamath – 9380022929"],
    registerLink: "#",
    fee: "₹300",
  },
  {
    time: "12:30 PM",
    title: "BATTLE OF PROMPTS",
    location: "Lab 5, Ground Floor, GCEM Campus",
    description: "Battle of Prompts: Participants must generate images using text-to-image prompts only, within the allowed attempts during the competition time. The final submission must include the generated image and exact prompt used, without external editing or pre-prepared prompts.",
    category: "Tech",
    prize: "₹4,500",
    minTeamSize: 1,
    maxTeamSize: 1,
    rules: ["1. Participants may use only text-to-image prompting; image-to-image, reference image, or control features are strictly prohibited.",
      "2. Each participant is allowed a maximum of 5–10 prompt generations per round.",
      "3. Participants must submit both the final generated image and the exact prompt used.",
      "4. Editing the generated image using external software (Photoshop, Canva, etc.) is not allowed.",
      "5. Participants must not use pre-saved prompts or templates prepared before the competition.",
      "6. Any AI-generated image must be produced during the competition time window.",
      "7. Participants must not share prompts, generated images, or strategies with others during the event.",
      "8. The reference image will be visible only for the duration specified by the organizers",
      "9. Participants may refine prompts iteratively but must select only one final submission.",
      "10. Organizers may request prompt history or generation logs for verification if required.",
      "11. The generated image must closely match the composition, objects, lighting, and style of the reference image.",
      "12. Participants must use only the approved AI tools announced by the organizers.",
      "13. In case of a tie, the participant with the highest similarity score and fewer attempts will be ranked higher.",
      "14. Any attempt to bypass tool restrictions or manipulate the judging process will result in disqualification.",
      "15. All participants must respect the competition environment and follow instructions given by the event coordinators.",
      "16. Please check the schedule for overlapping events before registering multiple events",
      "17. If you have registered for overlapping events, management is not responsible, no refund will be initiated.The participants from Gopalan Group of Institutions should contact the respective event coordinators before registering",
      "18. Report to the coordinators 30 minutes before the event starts",
      "19.Participants of other events will get a complimentary audience pass for VINTARA (Fashion Show).",
    ],
    coordinators: ["P Mohan - 9606629280", "Brunda - 8197283013"],
    registerLink: "#",
    fee: "₹200",
  },
]

function getCategoryStyles(category) {
  switch (category) {
    case "Tech":
      return "bg-blue-500/20 border-blue-400/30 text-blue-200"
    case "Fun":
      return "bg-pink-500/20 border-pink-400/30 text-pink-200"
    case "Workshop":
      return "bg-green-500/20 border-green-400/30 text-green-200"
    default:
      return "bg-purple-500/20 border-purple-400/30 text-purple-200"
  }
}

/* 🔹 STAGGER CHILD VARIANTS */
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0 },
}

function EventCard({ title, description, category, onClick }) {
  const cardRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-70, 70], [16, -16])
  const rotateY = useTransform(x, [-70, 70], [-16, 16])

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  /* CATEGORY COLORS */
  const categoryColors = {
    Tech: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    Workshop: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    Fun: "bg-pink-500/15 text-pink-300 border-pink-400/30",
    Fest: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    Hardware: "bg-teal-500/15 text-teal-300 border-teal-400/30",
    "AI/ML": "bg-indigo-500/15 text-indigo-300 border-indigo-400/30",
    Gaming: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/30",
  }

  /* OUTER GLOW */
  const glowColors = {
    Tech: "from-cyan-500/40 via-blue-500/30 to-indigo-500/40",
    Workshop: "from-emerald-500/40 via-green-500/30 to-teal-500/40",
    Fun: "from-pink-500/40 via-rose-500/30 to-fuchsia-500/40",
    Fest: "from-purple-500/40 via-violet-500/30 to-indigo-500/40",
    Hardware: "from-teal-500/40 via-cyan-500/30 to-blue-500/40",
    "AI/ML": "from-indigo-500/40 via-blue-500/30 to-violet-500/40",
    Gaming: "from-fuchsia-500/40 via-pink-500/30 to-purple-500/40",
  }

  /* INNER NEXERA TINT */
  const innerColors = {
    Tech: "from-cyan-500/10 via-blue-500/10 to-indigo-500/10",
    Workshop: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
    Fun: "from-pink-500/10 via-rose-500/10 to-fuchsia-500/10",
    Fest: "from-purple-500/10 via-violet-500/10 to-indigo-500/10",
    Hardware: "from-teal-500/10 via-cyan-500/10 to-blue-500/10",
    "AI/ML": "from-indigo-500/10 via-blue-500/10 to-violet-500/10",
    Gaming: "from-fuchsia-500/10 via-pink-500/10 to-purple-500/10",
  }

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative group cursor-pointer perspective"
    >
      {/* Glow (Replaced blur-2xl with simple radial gradient background for scroll performance) */}
      <div
        className={`absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.4),transparent)] opacity-50 group-hover:opacity-80 transition duration-500 will-change-transform transform-gpu`}
      />

      {/* Card body */}
      <div
        className={`relative rounded-2xl p-6 h-full flex flex-col justify-between
        bg-[linear-gradient(135deg,rgba(15,23,42,0.88),rgba(10,15,30,0.92))]
        bg-gradient-to-br ${innerColors[category] || innerColors.Tech}
        backdrop-blur-xl border border-white/10
        shadow-[0_10px_40px_rgba(0,0,0,0.4)]
        group-hover:border-white/20 transition`}
      >
        {/* Category */}
        <span
          className={`inline-block text-xs px-3 py-1 rounded-full border mb-4 w-fit ${categoryColors[category] || categoryColors.Tech
            }`}
        >
          {category}
        </span>

        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-white">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-400 mt-auto">
          <span className="group-hover:text-cyan-300 transition">
            View Details
          </span>
          <span className="transform group-hover:translate-x-1 transition">
            →
          </span>
        </div>
      </div>
    </motion.div>
  )
}





/* ─── CATEGORY GRADIENT MAPS ─── */
const headerGradients = {
  Tech: "from-cyan-600/90 via-blue-700/80 to-indigo-800/90",
  Fun: "from-pink-600/90 via-fuchsia-700/80 to-purple-800/90",
  Workshop: "from-emerald-600/90 via-green-700/80 to-teal-800/90",
}
const headerGlows = {
  Tech: "shadow-cyan-500/30",
  Fun: "shadow-pink-500/30",
  Workshop: "shadow-emerald-500/30",
}
const tabActiveColors = {
  Tech: "border-cyan-400 text-cyan-300",
  Fun: "border-pink-400 text-pink-300",
  Workshop: "border-emerald-400 text-emerald-300",
}

const buttonGradients = {
  Tech: "from-cyan-500 to-blue-600",
  Fun: "from-pink-500 to-purple-600",
  Workshop: "from-emerald-500 to-teal-600",
}
const buttonShadows = {
  Tech: "shadow-cyan-700/40 hover:shadow-cyan-500/60",
  Fun: "shadow-purple-700/40 hover:shadow-purple-500/60",
  Workshop: "shadow-emerald-700/40 hover:shadow-emerald-500/60",
}

/* ─── SMALL ICON COMPONENTS ─── */
const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
)
const IconMapPin = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
)
const IconTrophy = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V14.6a5 5 0 0 1-3.8-3.8L5 4h14l-1.2 6.8A5 5 0 0 1 14 14.6V22" /></svg>
)
const IconTicket = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></svg>
)
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
)

function EventModal({ event, isEventOpen, onClose, onRegister }) {
  const [activeTab, setActiveTab] = useState("about")

  // Reset modal state when event changes (fixes tab persistence bug)
  useEffect(() => {
    setActiveTab("about");
  }, [event]);

  if (!event) return null

  const cat = event.category || "Tech"
  const teamText = event.minTeamSize === event.maxTeamSize
    ? `${event.minTeamSize}`
    : `${event.minTeamSize || "?"} – ${event.maxTeamSize || "?"}`

  // Back button handling removed from here to parent

  const tabs = [
    { id: "about", label: "📋 About" },
    { id: "rules", label: "📜 Rules" },
    { id: "coordinators", label: "👥 Contact" },
  ]

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Modal */}
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl ${headerGlows[cat] || headerGlows.Tech} max-h-[90vh] flex flex-col`}
        >
          {/* ═══ GRADIENT HEADER ═══ */}
          <div className={`relative bg-gradient-to-r ${headerGradients[cat] || headerGradients.Tech} px-8 pt-8 pb-6`}>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-10 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />

            <button
              onClick={onClose}
              className="absolute top-4 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 text-white/70 hover:text-white hover:bg-black/50 transition text-lg"
            >
              ✕
            </button>

            {/* Category pill */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`inline-block text-[11px] uppercase tracking-widest px-3 py-1 rounded-full border mb-3 font-semibold ${getCategoryStyles(cat)}`}
            >
              {cat}
            </motion.span>

            {/* Title */}
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl font-extrabold text-white tracking-tight drop-shadow-lg"
            >
              {event.title}
            </motion.h3>
          </div>

          {/* ═══ INFO CHIPS BAR ═══ */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[rgba(10,10,25,0.95)] px-8 py-4 flex flex-wrap gap-3 border-b border-white/5"
          >
            {/* Time */}
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
              <IconClock /> {event.time}
            </span>
            {/* Location */}
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
              <IconMapPin /> {event.location}
            </span>
            {/* Prize */}
            {event.prize && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-300 font-medium">
                <IconTrophy /> {event.prize}
              </span>
            )}
            {/* Fee */}
            {event.fee && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-300 font-medium">
                <IconTicket /> {event.fee}
              </span>
            )}
            {/* Team Size */}
            <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
              <IconUsers /> Team: {teamText}
            </span>
            {/* Theme Chip */}
            {event.theme && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 font-medium">
                ✨ Theme: {event.theme}
              </span>
            )}
            {/* Combo Pass */}
            {event.comboPass && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-400/20 text-purple-300 font-medium">
                🎟️ Combo: {event.comboPass}
              </span>
            )}
          </motion.div>

          {/* ═══ TABS ═══ */}
          <div className="bg-[rgba(10,10,25,0.95)] px-8 pt-4">
            <div className="flex gap-1 border-b border-white/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${activeTab === tab.id
                    ? (tabActiveColors[cat] || tabActiveColors.Tech)
                    : "border-transparent text-gray-500 hover:text-gray-300"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ TAB CONTENT ═══ */}
          <div className="bg-[rgba(10,10,25,0.95)] px-8 py-6 overflow-y-auto flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "about" && (
                <div>
                  {event.description && (
                    <p className="text-gray-300 leading-relaxed text-sm">{event.description}</p>
                  )}
                </div>
              )}

              {activeTab === "rules" && event.rules && (
                <ul className="space-y-2.5">
                  {event.rules.map((rule, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="text-gray-300 text-sm"
                    >
                      {rule}
                    </motion.li>
                  ))}
                </ul>
              )}

              {activeTab === "coordinators" && event.coordinators && (
                <div className="space-y-3">
                  {event.coordinators.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {c.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {c.includes("–") ? c.split("–")[0].trim() : c.split("-")[0].trim()}
                        </p>
                        {(c.includes("–") || c.includes("-")) && (
                          <p className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">
                            <IconPhone /> {(c.includes("–") ? c.split("–")[1] : c.split("-")[1] || "").trim()}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* ═══ FOOTER / REGISTER BUTTON ═══ */}
          <div className="bg-[rgba(10,10,25,0.95)] px-8 pb-6 pt-2 border-t border-white/5">
            {isEventOpen ? (
              activeTab === "rules" ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onRegister}
                  className={`w-full text-center px-6 py-3.5 rounded-xl bg-gradient-to-r ${buttonGradients[cat] || buttonGradients.Tech} shadow-lg ${buttonShadows[cat] || buttonShadows.Tech} font-semibold text-white transition`}
                >
                  🚀 Register for this Event
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab("rules")}
                  className="w-full text-center px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-gray-200 font-semibold hover:bg-white/20 hover:text-white transition"
                >
                  📜 Read Rules to Register
                </motion.button>
              )
            ) : (
              <button
                disabled
                className="w-full text-center px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-500 font-bold uppercase tracking-widest cursor-not-allowed"
              >
                Registrations Closed
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* RegistrationForm moved to parent */}
    </>
  )
}

export default function Schedule({ onModalToggle }) {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showRegistration, setShowRegistration] = useState(false)
  const [filter, setFilter] = useState("All")
  const [search, setSearch] = useState("")
  const [eventStatuses, setEventStatuses] = useState([])

  // Notify parent of modal state
  useEffect(() => {
    onModalToggle && onModalToggle(!!selectedEvent || showRegistration);
  }, [selectedEvent, showRegistration, onModalToggle]);

  // Consolidated history handling for event details and registration form
  useEffect(() => {
    if (selectedEvent) {
      const currentState = window.history.state;

      if (showRegistration) {
        if (!currentState || currentState.modal !== "registration") {
          window.history.pushState({ modal: "registration" }, "");
        }
      } else {
        if (!currentState || (currentState.modal !== "event" && currentState.modal !== "registration")) {
          window.history.pushState({ modal: "event" }, "");
        }
      }

      const handlePopState = (e) => {
        if (!e.state) {
          setSelectedEvent(null);
          setShowRegistration(false);
        } else if (e.state.modal === "event") {
          setShowRegistration(false);
        } else if (e.state.modal === "registration") {
          setShowRegistration(true);
        } else {
          setSelectedEvent(null);
          setShowRegistration(false);
        }
      };

      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("popstate", handlePopState);
        // Cleanup: pushState is handled by the effect, so we don't need manual back() here
        // as popstate will handle the UI state correctly.
      };
    } else {
      if (showRegistration) setShowRegistration(false);
    }
  }, [selectedEvent, showRegistration]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/status?t=${Date.now()}`);
        const data = await res.json();
        if (data.success) {
          setEventStatuses(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch event statuses", err);
      }
    };
    fetchStatuses();

    const handleStatusChange = (e) => {
      if (e.detail) {
        setEventStatuses(prev => {
          const next = [...prev];
          const idx = next.findIndex(s => s.title === e.detail.eventTitle);
          if (idx >= 0) {
            next[idx].isOpen = e.detail.isOpen;
          } else {
            next.push({ title: e.detail.eventTitle, isOpen: e.detail.isOpen });
          }
          return next;
        });
      }
      fetchStatuses(); // Background sync
    };

    // Auto-refresh statuses every 30 seconds and listen for instant admin triggers
    const interval = setInterval(fetchStatuses, 30000);
    window.addEventListener('eventStatusChanged', handleStatusChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('eventStatusChanged', handleStatusChange);
    };
  }, []);

  const applyFilter = (events) => {
    return events.filter((e) => {
      const matchCategory = filter === "All" || e.category === filter
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }

  return (
    <>
      <motion.section
        id="events"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="min-h-screen px-6 py-20"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-pink-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
          OUR EVENTS
        </h2>

        {/* Search */}
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {["All", "Tech", "Fun"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition ${filter === cat
                ? "bg-purple-600 border-purple-400 text-white"
                : "bg-white/10 border-white/20 text-gray-300 hover:border-purple-400"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-w-5xl mx-auto space-y-16">
          {/* Day 1 */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-purple-300">
              April 10
            </h3>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"

            >
              {applyFilter(eventsDay1).map((e, i) => (
                <EventCard key={i} {...e} onClick={() => setSelectedEvent(e)} />
              ))}
            </motion.div>
          </div>

          {/* Day 2 */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-blue-300">
              April 11
            </h3>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6"
            >
              {applyFilter(eventsDay2).map((e, i) => (
                <EventCard key={i} {...e} onClick={() => setSelectedEvent(e)} />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {showRegistration && selectedEvent ? (
          <RegistrationForm
            key="registration-form"
            event={selectedEvent}
            onClose={() => setShowRegistration(false)}
          />
        ) : selectedEvent ? (
          <EventModal
            key="event-modal"
            event={selectedEvent}
            isEventOpen={(eventStatuses.find(s => s.title === selectedEvent.title)?.isOpen ?? true)}
            onClose={() => setSelectedEvent(null)}
            onRegister={() => setShowRegistration(true)}
          />
        ) : null}
      </AnimatePresence>
    </>
  )
}
