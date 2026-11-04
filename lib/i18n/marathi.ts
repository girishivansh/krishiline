// Marathi (मराठी) & English translations for Krishi-Line digital agri-procurement

export type Language = "en" | "mr";

export const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Tagline
    app_name: "Krishi-Line",
    app_subtitle: "Government of India & Government of Maharashtra Procurement Portal",
    tagline: "Fair Prices, Guaranteed Slots, Zero Middlemen",
    hero_title: "Transparent Agri-Procurement Infrastructure",
    hero_desc: "Eliminating mandi wait queues and corruption with guaranteed 4-hour delivery slots, optical quality grading, and automated PFMS direct benefit payouts.",

    // Nav
    nav_home: "Overview",
    nav_farmer: "Farmer Portal",
    nav_workflow: "6-Step Workflow",
    nav_roles: "Roles",
    nav_demo: "Judge Showcase",
    nav_login: "Login",
    nav_logout: "Logout",

    // Farmer Portal
    farmer_portal_title: "Farmer Digital Self-Service Portal",
    farmer_portal_sub: "Real-time delivery slot booking, 7/12 land ceiling tracking, and direct bank disbursement status.",
    land_record_title: "Maharashtra MahaBhulekh 7/12 Land Record",
    registered_farmer: "Registered Farmer",
    survey_number: "Survey No.",
    district_taluka: "District & Taluka",
    seasonal_quota: "Seasonal Yield Ceiling (NAFED)",
    quota_used: "Procured to Date",
    quota_remaining: "Available Balance",
    book_new_slot: "Book Guaranteed Delivery Slot",
    view_active_pass: "Active Delivery QR Pass",
    recent_procurements: "Recent Procurement Receipts",
    slot_window_label: "Guaranteed 4-Hour Unloading Window",
    standby_cushion_label: "10% Hourly Standby Cushion Active",
    net_payable: "Net Payable (Direct DBT)",
    quality_grade: "Verified Quality Grade",
    scale_weight: "Certified Scale Weight",

    // Roles
    role_clerk: "Government Mandi Clerk",
    role_warehouse: "Warehouse Gate Supervisor",
    role_accountant: "Center Accountant",
    role_collector: "District Magistrate / Collector",
    role_fpo: "FPO Procurement Aggregator",
    role_admin: "System Administrator",

    // Actions
    confirm_booking: "Confirm Slot Booking",
    download_receipt: "Download Weighment Slip",
    scan_qr: "Scan Barricade QR",
    run_optical_scan: "Run Krishi-Vision Optical Scan",
    dispatch_flying_squad: "Dispatch Flying Squad Raid",
  },
  mr: {
    // Brand & Tagline
    app_name: "कृषी-लाईन",
    app_subtitle: "भारत सरकार व महाराष्ट्र शासन डिजिटल कांदा खरेदी प्रणाली",
    tagline: "रास्त भाव, निश्चित वेळ, दलालांना पूर्ण आळा",
    hero_title: "पारदर्शक डिजिटल शेतीमाल खरेदी पायाभूत सुविधा",
    hero_desc: "४ तासांच्या निश्चित वितरण स्लॉट, ऑप्टिकल गुणवत्ता तपासणी आणि थेट PFMS बँक खात्यात रक्कम जमा करून बाजार समितीमधील रांगा व भ्रष्टाचार संपवा.",

    // Nav
    nav_home: "मुख्य पृष्ठ",
    nav_farmer: "शेतकरी पोर्टल",
    nav_workflow: "६-टप्पे कार्यप्रणाली",
    nav_roles: "अधिकारी दालन",
    nav_demo: "परीक्षक शोकेस",
    nav_login: "लॉगिन",
    nav_logout: "बाहेर पडा",

    // Farmer Portal
    farmer_portal_title: "शेतकरी डिजिटल स्वयंचलित पोर्टल",
    farmer_portal_sub: "थेट स्लॉट बुकिंग, ७/१२ जमीन पीक मर्यादा आणि खात्यात जमा होणाऱ्या रकमेची थेट माहिती.",
    land_record_title: "महाराष्ट्र महाभूलेख ७/१२ जमीन नोंदणी",
    registered_farmer: "नोंदणीकृत शेतकरी",
    survey_number: "गट क्र. / सर्व्हे",
    district_taluka: "जिल्हा व तालुका",
    seasonal_quota: "हंगामी खरेदी मर्यादा (नाफेड)",
    quota_used: "आतापर्यंत विक्री",
    quota_remaining: "उर्वरित शिल्लक कोटा",
    book_new_slot: "निश्चित स्लॉट बुक करा",
    view_active_pass: "सक्रिय डिजिटल क्यूआर पास",
    recent_procurements: "अलिकडील खरेदी पावत्या",
    slot_window_label: "हमी दिलेली ४ तासांची अनलोडिंग वेळ",
    standby_cushion_label: "१०% ताशी राखीव कोटा सक्रिय",
    net_payable: "एकूण देय रक्कम (थेट बँक जमा)",
    quality_grade: "तपासलेला कांदा दर्जा (ग्रेड)",
    scale_weight: "वजनकाट्यावरील अधिकृत वजन",

    // Roles
    role_clerk: "शासकीय वजन व प्रतवारी कारकून",
    role_warehouse: "गोदाम सुरक्षा व गेट पर्यवेक्षक",
    role_accountant: "खरेदी केंद्र लेखापाल",
    role_collector: "जिल्हाधिकारी व दक्षता समिती",
    role_fpo: "शेतकरी उत्पादक कंपनी (FPO)",
    role_admin: "प्रणाली प्रशासक",

    // Actions
    confirm_booking: "स्लॉट निश्चित करा",
    download_receipt: "खरेदी पावती डाऊनलोड करा",
    scan_qr: "क्यूआर कोड स्कॅन करा",
    run_optical_scan: "कृषी-व्हिजन एआय गुणवत्ता तपासणी करा",
    dispatch_flying_squad: "दक्षता भरारी पथक धाडा",
  },
};
