import type { Profile } from '@/types/cv-builder';

// Dynamic imports for pdfmake to avoid SSR issues
let pdfMake: any = null;
let vfsFonts: any = null;

// Initialize pdfmake only in browser environment
async function initializePdfMake() {
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available in browser environment');
  }

  if (!pdfMake) {
    try {
      const [pdfMakeModule, vfsFontsModule] = await Promise.all([
        import('pdfmake/build/pdfmake'),
        import('pdfmake/build/vfs_fonts'),
      ]);

      pdfMake = pdfMakeModule.default;
      vfsFonts = vfsFontsModule.default;

      // Set virtual file system fonts - handle different possible structures
      if (vfsFonts.pdfMake && vfsFonts.pdfMake.vfs) {
        pdfMake.vfs = vfsFonts.pdfMake.vfs;
      } else if (vfsFonts.vfs) {
        pdfMake.vfs = vfsFonts.vfs;
      } else {
        // Fallback: try to access vfs directly
        pdfMake.vfs = vfsFonts;
      }
    } catch (error) {
      console.error('Failed to load pdfmake:', error);
      throw new Error('Failed to initialize PDF generation library');
    }
  }
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  popular?: boolean;
}

export const frontendCVService = {
  // Initialize pdfmake
  async initialize() {
    await initializePdfMake();
  },

  // Modern ATS-friendly template
  async generateModernCV(profile: Profile): Promise<Blob> {
    await this.initialize();

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 40],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
        lineHeight: 1.2,
      },
      fonts: {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf',
        },
      },
      content: [
        // Header
        {
          text: profile.fullName.toUpperCase(),
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 5],
        },
        {
          text: profile.title,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: profile.slogan || '',
          style: 'summary',
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        // Contact Information
        {
          columns: [
            {
              text: [
                { text: 'Email: ', bold: true },
                profile.email,
                '\n',
                { text: 'Phone: ', bold: true },
                profile.phone || 'N/A',
              ],
              width: '*',
            },
            {
              text: [
                { text: 'Location: ', bold: true },
                profile.address || 'N/A',
                '\n',
                { text: 'LinkedIn: ', bold: true },
                profile.linkedin || 'N/A',
              ],
              width: '*',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Professional Summary
        ...(profile.slogan
          ? [
              {
                text: 'PROFESSIONAL SUMMARY',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10],
              },
              {
                text: profile.slogan,
                style: 'bodyText',
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Work Experience
        {
          text: 'PROFESSIONAL EXPERIENCE',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        ...profile.experience
          .map((exp: any) => [
            {
              text: [
                { text: exp.position, bold: true },
                ' | ',
                { text: exp.company, bold: true },
                ' | ',
                { text: exp.location || '', italic: true },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
              style: 'dateText',
              margin: [0, 0, 0, 5],
            },
            {
              text: exp.description,
              style: 'bodyText',
              margin: [0, 0, 0, 10],
            },
          ])
          .flat(),

        // Education
        {
          text: 'EDUCATION',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        },
        ...profile.education
          .map((edu: any) => [
            {
              text: [
                { text: edu.degree, bold: true },
                ' | ',
                { text: edu.institution, bold: true },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
              style: 'dateText',
              margin: [0, 0, 0, 5],
            },
            ...(edu.description
              ? [
                  {
                    text: edu.description,
                    style: 'bodyText',
                    margin: [0, 0, 0, 10],
                  },
                ]
              : []),
          ])
          .flat(),

        // Skills
        ...(profile.skills.length > 0
          ? [
              {
                text: 'TECHNICAL SKILLS',
                style: 'sectionHeader',
                margin: [0, 20, 0, 10],
              },
              {
                text: profile.skills.join(' • '),
                style: 'bodyText',
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Projects
        ...(profile.projects.length > 0
          ? [
              {
                text: 'PROJECTS',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10],
              },
              ...profile.projects
                .map((project: any) => [
                  {
                    text: [
                      { text: project.name, bold: true },
                      ...(project.url
                        ? [' | ', { text: project.url, color: 'blue' }]
                        : []),
                    ],
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: `${project.startDate} - ${project.current ? 'Present' : project.endDate}`,
                    style: 'dateText',
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: project.description,
                    style: 'bodyText',
                    margin: [0, 0, 0, 10],
                  },
                ])
                .flat(),
            ]
          : []),

        // Certificates
        ...(profile.certificates.length > 0
          ? [
              {
                text: 'CERTIFICATIONS',
                style: 'sectionHeader',
                margin: [0, 20, 0, 10],
              },
              ...profile.certificates
                .map((cert: any) => [
                  {
                    text: [
                      { text: cert.name, bold: true },
                      ' | ',
                      { text: cert.issuer, italic: true },
                    ],
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: cert.date,
                    style: 'dateText',
                    margin: [0, 0, 0, 10],
                  },
                ])
                .flat(),
            ]
          : []),

        // Awards
        ...(profile.awards.length > 0
          ? [
              {
                text: 'AWARDS & RECOGNITIONS',
                style: 'sectionHeader',
                margin: [0, 20, 0, 10],
              },
              ...profile.awards
                .map((award: any) => [
                  {
                    text: [
                      { text: award.title, bold: true },
                      ' | ',
                      { text: award.issuer, italic: true },
                    ],
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: award.date,
                    style: 'dateText',
                    margin: [0, 0, 0, 10],
                  },
                ])
                .flat(),
            ]
          : []),
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#1f2937',
        },
        subheader: {
          fontSize: 16,
          bold: true,
          color: '#374151',
        },
        summary: {
          fontSize: 11,
          color: '#6b7280',
          fontStyle: 'italic',
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#1f2937',
          borderBottom: '1px solid #d1d5db',
          paddingBottom: 5,
        },
        bodyText: {
          fontSize: 10,
          color: '#374151',
          lineHeight: 1.4,
        },
        dateText: {
          fontSize: 9,
          color: '#6b7280',
          fontStyle: 'italic',
        },
      },
    };

    return new Promise<Blob>((resolve, reject) => {
      pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
  },

  // Classic ATS-friendly template
  async generateClassicCV(profile: Profile): Promise<Blob> {
    await this.initialize();

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [50, 50, 50, 50],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 11,
        lineHeight: 1.3,
      },
      fonts: {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf',
        },
      },
      content: [
        // Header
        {
          text: profile.fullName,
          style: 'header',
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          text: profile.title,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 0, 0, 15],
        },

        // Contact Information
        {
          text: [
            { text: 'Address: ', bold: true },
            profile.address || 'N/A',
            ' | ',
            { text: 'Email: ', bold: true },
            profile.email,
            ' | ',
            { text: 'Phone: ', bold: true },
            profile.phone || 'N/A',
          ],
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        // Professional Summary
        ...(profile.slogan
          ? [
              {
                text: 'PROFESSIONAL SUMMARY',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10],
              },
              {
                text: profile.slogan,
                style: 'bodyText',
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Work Experience
        {
          text: 'PROFESSIONAL EXPERIENCE',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        ...profile.experience
          .map((exp: any) => [
            {
              text: [
                { text: exp.position, bold: true },
                ', ',
                { text: exp.company, bold: true },
                ...(exp.location
                  ? [', ', { text: exp.location, italic: true }]
                  : []),
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
              style: 'dateText',
              margin: [0, 0, 0, 8],
            },
            {
              text: exp.description,
              style: 'bodyText',
              margin: [0, 0, 0, 15],
            },
          ])
          .flat(),

        // Education
        {
          text: 'EDUCATION',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        },
        ...profile.education
          .map((edu: any) => [
            {
              text: [
                { text: edu.degree, bold: true },
                ', ',
                { text: edu.institution, bold: true },
              ],
              margin: [0, 0, 0, 5],
            },
            {
              text: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
              style: 'dateText',
              margin: [0, 0, 0, 8],
            },
            ...(edu.description
              ? [
                  {
                    text: edu.description,
                    style: 'bodyText',
                    margin: [0, 0, 0, 15],
                  },
                ]
              : []),
          ])
          .flat(),

        // Skills
        ...(profile.skills.length > 0
          ? [
              {
                text: 'SKILLS',
                style: 'sectionHeader',
                margin: [0, 20, 0, 10],
              },
              {
                text: profile.skills.join(', '),
                style: 'bodyText',
                margin: [0, 0, 0, 20],
              },
            ]
          : []),

        // Additional sections
        ...(profile.certificates.length > 0
          ? [
              {
                text: 'CERTIFICATIONS',
                style: 'sectionHeader',
                margin: [0, 0, 0, 10],
              },
              ...profile.certificates
                .map((cert: any) => [
                  {
                    text: [
                      { text: cert.name, bold: true },
                      ', ',
                      { text: cert.issuer, italic: true },
                    ],
                    margin: [0, 0, 0, 5],
                  },
                  {
                    text: cert.date,
                    style: 'dateText',
                    margin: [0, 0, 0, 10],
                  },
                ])
                .flat(),
            ]
          : []),
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#000000',
        },
        subheader: {
          fontSize: 14,
          bold: true,
          color: '#333333',
        },
        sectionHeader: {
          fontSize: 13,
          bold: true,
          color: '#000000',
          borderBottom: '1px solid #000000',
          paddingBottom: 3,
        },
        bodyText: {
          fontSize: 11,
          color: '#333333',
          lineHeight: 1.4,
        },
        dateText: {
          fontSize: 10,
          color: '#666666',
          fontStyle: 'italic',
        },
      },
    };

    return new Promise<Blob>((resolve, reject) => {
      pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
  },

  // Creative template (less ATS-friendly but visually appealing)
  async generateCreativeCV(profile: Profile): Promise<Blob> {
    await this.initialize();

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [25, 25, 25, 25],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 10,
        lineHeight: 1.2,
      },
      fonts: {
        Roboto: {
          normal: 'Roboto-Regular.ttf',
          bold: 'Roboto-Medium.ttf',
          italics: 'Roboto-Italic.ttf',
          bolditalics: 'Roboto-MediumItalic.ttf',
        },
      },
      content: [
        // Header with gradient-like background
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 545,
              h: 100,
              color: '#4f46e5',
            },
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 545,
              h: 100,
              color: '#6366f1',
              opacity: 0.8,
            },
          ],
          absolutePosition: { x: 25, y: 25 },
        },

        // Header text
        {
          text: profile.fullName.toUpperCase(),
          style: 'creativeHeader',
          absolutePosition: { x: 45, y: 45 },
        },
        {
          text: profile.title,
          style: 'creativeSubheader',
          absolutePosition: { x: 45, y: 75 },
        },

        // Decorative accent line
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 180,
              h: 3,
              color: '#f59e0b',
            },
          ],
          absolutePosition: { x: 25, y: 140 },
        },

        // Main content area with two columns
        {
          columns: [
            // Left column - Sidebar
            {
              width: 180,
              stack: [
                // Contact section
                {
                  text: 'CONTACT',
                  style: 'sidebarHeader',
                  margin: [0, 20, 0, 15],
                },
                {
                  text: [
                    { text: '📧 ', fontSize: 11 },
                    profile.email,
                    '\n\n',
                    { text: '📱 ', fontSize: 11 },
                    profile.phone || 'N/A',
                    '\n\n',
                    { text: '📍 ', fontSize: 11 },
                    profile.address || 'N/A',
                    '\n\n',
                    { text: '🔗 ', fontSize: 11 },
                    profile.linkedin || 'N/A',
                    ...(profile.github
                      ? ['\n\n', { text: '💻 ', fontSize: 11 }, profile.github]
                      : []),
                    ...(profile.website
                      ? ['\n\n', { text: '🌐 ', fontSize: 11 }, profile.website]
                      : []),
                  ],
                  style: 'sidebarText',
                  margin: [0, 0, 0, 30],
                },

                // Skills section
                ...(profile.skills.length > 0
                  ? [
                      {
                        text: 'SKILLS',
                        style: 'sidebarHeader',
                        margin: [0, 0, 0, 15],
                      },
                      {
                        text: profile.skills
                          .map((skill) => `• ${skill}`)
                          .join('\n'),
                        style: 'sidebarText',
                        margin: [0, 0, 0, 30],
                      },
                    ]
                  : []),

                // Certificates section
                ...(profile.certificates.length > 0
                  ? [
                      {
                        text: 'CERTIFICATIONS',
                        style: 'sidebarHeader',
                        margin: [0, 0, 0, 15],
                      },
                      ...profile.certificates.map((cert: any) => ({
                        text: [
                          { text: cert.name, bold: true, fontSize: 9 },
                          '\n',
                          {
                            text: cert.issuer,
                            italic: true,
                            fontSize: 8,
                            color: '#6b7280',
                          },
                          '\n',
                          { text: cert.date, fontSize: 8, color: '#9ca3af' },
                        ],
                        margin: [0, 0, 0, 10],
                      })),
                    ]
                  : []),

                // Awards section
                ...(profile.awards.length > 0
                  ? [
                      {
                        text: 'AWARDS',
                        style: 'sidebarHeader',
                        margin: [0, 20, 0, 15],
                      },
                      ...profile.awards.map((award: any) => ({
                        text: [
                          { text: award.title, bold: true, fontSize: 9 },
                          '\n',
                          {
                            text: award.issuer,
                            italic: true,
                            fontSize: 8,
                            color: '#6b7280',
                          },
                          '\n',
                          { text: award.date, fontSize: 8, color: '#9ca3af' },
                        ],
                        margin: [0, 0, 0, 10],
                      })),
                    ]
                  : []),
              ],
            },

            // Right column - Main content
            {
              width: '*',
              stack: [
                // About section
                {
                  text: 'ABOUT',
                  style: 'mainHeader',
                  margin: [0, 20, 0, 15],
                },
                {
                  text: profile.slogan || 'Professional summary goes here.',
                  style: 'mainText',
                  margin: [0, 0, 0, 30],
                },

                // Experience section
                {
                  text: 'EXPERIENCE',
                  style: 'mainHeader',
                  margin: [0, 0, 0, 20],
                },
                ...profile.experience
                  .map((exp: any) => [
                    {
                      text: [
                        {
                          text: exp.position,
                          bold: true,
                          color: '#4f46e5',
                          fontSize: 12,
                        },
                        ' at ',
                        { text: exp.company, bold: true, fontSize: 12 },
                        ...(exp.location
                          ? [
                              ' • ',
                              {
                                text: exp.location,
                                italic: true,
                                fontSize: 11,
                              },
                            ]
                          : []),
                      ],
                      margin: [0, 0, 0, 8],
                    },
                    {
                      text: `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`,
                      style: 'dateText',
                      margin: [0, 0, 0, 12],
                    },
                    {
                      text: exp.description,
                      style: 'mainText',
                      margin: [0, 0, 0, 20],
                    },
                  ])
                  .flat(),

                // Education section
                {
                  text: 'EDUCATION',
                  style: 'mainHeader',
                  margin: [0, 20, 0, 20],
                },
                ...profile.education
                  .map((edu: any) => [
                    {
                      text: [
                        {
                          text: edu.degree,
                          bold: true,
                          color: '#4f46e5',
                          fontSize: 12,
                        },
                        ' from ',
                        { text: edu.institution, bold: true, fontSize: 12 },
                        ...(edu.location
                          ? [
                              ' • ',
                              {
                                text: edu.location,
                                italic: true,
                                fontSize: 11,
                              },
                            ]
                          : []),
                      ],
                      margin: [0, 0, 0, 8],
                    },
                    {
                      text: `${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`,
                      style: 'dateText',
                      margin: [0, 0, 0, 12],
                    },
                    ...(edu.description
                      ? [
                          {
                            text: edu.description,
                            style: 'mainText',
                            margin: [0, 0, 0, 20],
                          },
                        ]
                      : []),
                  ])
                  .flat(),

                // Projects section
                ...(profile.projects.length > 0
                  ? [
                      {
                        text: 'PROJECTS',
                        style: 'mainHeader',
                        margin: [0, 20, 0, 20],
                      },
                      ...profile.projects
                        .map((project: any) => [
                          {
                            text: [
                              {
                                text: project.name,
                                bold: true,
                                color: '#4f46e5',
                                fontSize: 12,
                              },
                              ...(project.url
                                ? [
                                    ' • ',
                                    {
                                      text: project.url,
                                      color: '#3b82f6',
                                      fontSize: 11,
                                    },
                                  ]
                                : []),
                            ],
                            margin: [0, 0, 0, 8],
                          },
                          {
                            text: `${project.startDate} - ${project.current ? 'Present' : project.endDate}`,
                            style: 'dateText',
                            margin: [0, 0, 0, 12],
                          },
                          {
                            text: project.description,
                            style: 'mainText',
                            margin: [0, 0, 0, 20],
                          },
                        ])
                        .flat(),
                    ]
                  : []),

                // Publications section
                ...(profile.publications.length > 0
                  ? [
                      {
                        text: 'PUBLICATIONS',
                        style: 'mainHeader',
                        margin: [0, 20, 0, 20],
                      },
                      ...profile.publications
                        .map((pub: any) => [
                          {
                            text: [
                              {
                                text: pub.title,
                                bold: true,
                                color: '#4f46e5',
                                fontSize: 12,
                              },
                              ' • ',
                              {
                                text: pub.publisher,
                                italic: true,
                                fontSize: 11,
                              },
                            ],
                            margin: [0, 0, 0, 8],
                          },
                          {
                            text: pub.date,
                            style: 'dateText',
                            margin: [0, 0, 0, 20],
                          },
                        ])
                        .flat(),
                    ]
                  : []),
              ],
            },
          ],
          margin: [0, 160, 0, 0],
        },
      ],
      styles: {
        creativeHeader: {
          fontSize: 32,
          bold: true,
          color: '#ffffff',
          letterSpacing: 1,
        },
        creativeSubheader: {
          fontSize: 16,
          color: '#ffffff',
          opacity: 0.95,
          letterSpacing: 0.5,
        },
        sidebarHeader: {
          fontSize: 13,
          bold: true,
          color: '#4f46e5',
          borderBottom: '2px solid #4f46e5',
          paddingBottom: 5,
          letterSpacing: 0.5,
        },
        sidebarText: {
          fontSize: 9,
          color: '#374151',
          lineHeight: 1.5,
        },
        mainHeader: {
          fontSize: 18,
          bold: true,
          color: '#1f2937',
          borderBottom: '3px solid #4f46e5',
          paddingBottom: 8,
          letterSpacing: 0.5,
        },
        mainText: {
          fontSize: 10,
          color: '#374151',
          lineHeight: 1.5,
        },
        dateText: {
          fontSize: 9,
          color: '#6b7280',
          fontStyle: 'italic',
        },
      },
    };

    return new Promise<Blob>((resolve, reject) => {
      pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
        resolve(blob);
      });
    });
  },

  // Generate CV with specified template
  async generateCV(profile: Profile, template = 'modern'): Promise<Blob> {
    switch (template) {
      case 'modern':
        return this.generateModernCV(profile);
      case 'classic':
        return this.generateClassicCV(profile);
      case 'creative':
        return this.generateCreativeCV(profile);
      default:
        return this.generateModernCV(profile);
    }
  },

  // Download CV as PDF
  async downloadCV(
    profile: Profile,
    template = 'modern',
    filename?: string,
  ): Promise<void> {
    const blob = await this.generateCV(profile, template);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      filename ||
        `${profile.fullName.toLowerCase().replace(/\s+/g, '-')}-cv-${template}.pdf`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Save generated CV as default resume
  async saveGeneratedResumeAsDefault(
    userId: string,
    profile: Profile,
    template = 'modern',
  ): Promise<{ resume: any }> {
    try {
      // Import profileService dynamically to avoid circular dependencies
      const { profileService } = await import('./profileService');

      // Generate the PDF blob
      const pdfBlob = await this.generateCV(profile, template);

      // Convert blob to file
      const fileName = `${profile.fullName.toLowerCase().replace(/\s+/g, '-')}-cv-${template}.pdf`;
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

      // Upload the file as the user's default resume
      const result = await profileService.uploadResume(userId, file);

      return result;
    } catch (error) {
      console.error('Error saving generated CV as default:', error);
      throw error;
    }
  },

  // Test function to verify CV generation
  async testCVGeneration(): Promise<void> {
    const testProfile: Profile = {
      fullName: 'Test User',
      title: 'Software Engineer',
      slogan:
        'Passionate developer with experience in modern web technologies.',
      email: 'test@example.com',
      phone: '+1 (555) 123-4567',
      address: 'San Francisco, CA',
      profilePicture: '',
      linkedin: 'https://linkedin.com/in/testuser',
      github: 'https://github.com/testuser',
      twitter: 'https://twitter.com/testuser',
      website: 'https://testuser.dev',
      skills: ['React', 'TypeScript', 'Node.js', 'Python'],
      experience: [
        {
          position: 'Software Engineer',
          company: 'Tech Company',
          startDate: '2020-01',
          endDate: '2023-12',
          current: false,
          description: 'Developed and maintained web applications.',
          location: 'San Francisco, CA',
        },
      ],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of California',
          field: 'Computer Science',
          startDate: '2016-09',
          endDate: '2020-05',
          current: false,
          description: 'Graduated with honors.',
          location: 'Berkeley, CA',
        },
      ],
      certificates: [],
      publications: [],
      projects: [],
      awards: [],
      interests: [],
      volunteer: [],
      references: [],
    };

    try {
      await this.downloadCV(testProfile, 'modern');
      console.log('CV generation test successful!');
    } catch (error) {
      console.error('CV generation test failed:', error);
      throw error;
    }
  },
};

export const cvTemplates: CVTemplate[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design',
    preview: '/images/cv-templates/modern.png',
    popular: true,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional and formal layout',
    preview: '/images/cv-templates/classic.png',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Stand out with unique styling',
    preview: '/images/cv-templates/creative.png',
  },
];

// Helper function to convert object to array and handle different field names
function normalizeProfileData(profile: any): Profile {
  // Helper to convert object to array if needed
  const toArray = (data: any): any[] => {
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object') {
      return Object.values(data).filter(
        (item) => item && typeof item === 'object',
      );
    }
    return [];
  };

  return {
    ...profile,
    experience: toArray(
      profile.experience ||
        profile.experiences ||
        profile.workExperience ||
        profile.work_experience,
    ),
    education: toArray(
      profile.education ||
        profile.educations ||
        profile.academicBackground ||
        profile.academic_background,
    ),
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    certificates: toArray(
      profile.certificates || profile.certifications || profile.certs,
    ),
    publications: toArray(profile.publications || profile.pubs),
    projects: toArray(
      profile.projects || profile.portfolio || profile.portfolios,
    ),
    awards: toArray(profile.awards || profile.achievements || profile.honors),
    interests: Array.isArray(profile.interests) ? profile.interests : [],
    volunteer: toArray(
      profile.volunteer || profile.volunteering || profile.volunteerWork,
    ),
    references: toArray(profile.references || profile.referees),
  };
}
