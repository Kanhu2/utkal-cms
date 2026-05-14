<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class SwaggerController extends Controller
{
    public function ui(): Response
    {
        $specUrl = url('/openapi.json');

        return response(<<<HTML
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Utkal CMS API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
    <style>
        body { margin: 0; background: #f8fafc; }
        .swagger-ui .topbar { display: none; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
        window.onload = function () {
            window.ui = SwaggerUIBundle({
                url: "{$specUrl}",
                dom_id: "#swagger-ui",
                deepLinking: true,
                persistAuthorization: true,
            });
        };
    </script>
</body>
</html>
HTML);
    }

    public function spec(): JsonResponse
    {
        return response()->json([
            'openapi' => '3.0.3',
            'info' => [
                'title' => 'Utkal CMS API',
                'version' => '1.0.0',
            ],
            'servers' => [
                [
                    'url' => url('/api'),
                    'description' => 'Local API server',
                ],
            ],
            'components' => [
                'securitySchemes' => [
                    'bearerAuth' => [
                        'type' => 'http',
                        'scheme' => 'bearer',
                        'bearerFormat' => 'JWT',
                        'description' => 'Paste only the access_token value from login. Do not include the word Bearer.',
                    ],
                ],
                'schemas' => [
                    'Department' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 3],
                            'name' => ['type' => 'string', 'example' => 'Department of Computer Science'],
                        ],
                    ],
                    'LoginRequest' => [
                        'type' => 'object',
                        'required' => ['email', 'password'],
                        'properties' => [
                            // 'department_id' => ['type' => 'integer', 'example' => 3],
                            'email' => ['type' => 'string', 'format' => 'email', 'example' => 'jyoti@dzinepixel.com'],
                            'password' => ['type' => 'string', 'format' => 'password', 'example' => 'Jyoti@123'],
                        ],
                    ],
                    'RegisterRequest' => [
                        'type' => 'object',
                        'required' => ['name', 'email', 'password', 'department_id'],
                        'properties' => [
                            'name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'email' => ['type' => 'string', 'format' => 'email', 'example' => 'jyoti@dzinepixel.com'],
                            'password' => ['type' => 'string', 'format' => 'password', 'example' => 'Jyoti@123'],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                        ],
                    ],
                    'RegisterResponse' => [
                        'type' => 'object',
                        'properties' => [
                            'message' => ['type' => 'string', 'example' => 'User registered successfully.'],
                            'user' => ['$ref' => '#/components/schemas/User'],
                        ],
                    ],
                    'LoginResponse' => [
                        'type' => 'object',
                        'properties' => [
                            'message' => ['type' => 'string', 'example' => 'Login successful.'],
                            'token_type' => ['type' => 'string', 'example' => 'Bearer'],
                            'access_token' => ['type' => 'string', 'example' => 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'],
                            'expires_in' => ['type' => 'integer', 'example' => 86400],
                            'dashboard_url' => ['type' => 'string', 'example' => '/api/dashboard'],
                            'user' => ['$ref' => '#/components/schemas/User'],
                        ],
                    ],
                    'User' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'email' => ['type' => 'string', 'format' => 'email', 'example' => 'jyoti@dzinepixel.com'],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                        ],
                    ],
                    'Notice' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'title' => ['type' => 'string', 'example' => 'Semester Exam Notice'],
                            'category' => ['type' => 'string', 'example' => 'Exam'],
                            'file' => ['type' => 'string', 'nullable' => true, 'example' => 'notices/exam-notice.pdf'],
                            'file_url' => ['type' => 'string', 'nullable' => true, 'example' => 'http://127.0.0.1:8000/storage/notices/exam-notice.pdf'],
                            'link' => ['type' => 'string', 'nullable' => true, 'example' => 'https://example.com/notice'],
                            'publish_date' => ['type' => 'string', 'format' => 'date', 'example' => '2026-05-06'],
                            'last_date' => ['type' => 'string', 'format' => 'date', 'example' => '2026-05-15'],
                        ],
                    ],
                    'Tender' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'title' => ['type' => 'string', 'example' => 'Laboratory Equipment Tender'],
                            'file' => ['type' => 'string', 'nullable' => true, 'example' => 'tenders/lab-equipment.pdf'],
                            'file_url' => ['type' => 'string', 'nullable' => true, 'example' => 'http://127.0.0.1:8000/storage/tenders/lab-equipment.pdf'],
                            'link' => ['type' => 'string', 'nullable' => true, 'example' => 'https://example.com/tender'],
                            'start_date' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'end_date' => ['type' => 'string', 'example' => '20-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                        ],
                    ],
                    'NewsEvent' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'title' => ['type' => 'string', 'example' => 'Department Seminar and Workshop'],
                            'file' => ['type' => 'string', 'nullable' => true, 'example' => 'news-events/files/seminar-details.pdf'],
                            'file_url' => ['type' => 'string', 'nullable' => true, 'example' => 'http://127.0.0.1:8000/storage/news-events/files/seminar-details.pdf'],
                            'link' => ['type' => 'string', 'nullable' => true, 'example' => 'https://example.com/news-event'],
                            'image' => ['type' => 'string', 'example' => 'news-events/images/seminar-banner.jpg'],
                            'image_url' => ['type' => 'string', 'example' => 'http://127.0.0.1:8000/storage/news-events/images/seminar-banner.jpg'],
                            'create_date' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'updated_at' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'preview' => ['type' => 'string', 'nullable' => true, 'example' => '0'],
                        ],
                    ],
                    'Publication' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'publication_details' => ['type' => 'string', 'example' => '<p>Publication content from editor</p>'],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'updated_by' => ['type' => 'string', 'example' => 'Jyoti'],
                            'create_date' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'updated_at' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'preview' => ['type' => 'string', 'nullable' => true, 'example' => '0'],
                        ],
                    ],
                    'PublicationRequest' => [
                        'type' => 'object',
                        'required' => ['content'],
                        'properties' => [
                            'content' => [
                                'type' => 'string',
                                'example' => '<p>This is <strong>rich text</strong> from editor.</p>',
                                'description' => 'Rich text/HTML content from the text editor.',
                            ],
                        ],
                    ],
                    'Ilms' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'title' => ['type' => 'string', 'example' => 'Digital Library Resource'],
                            'description' => ['type' => 'string', 'example' => 'Study material and LMS resources for department students.'],
                            'file' => ['type' => 'string', 'example' => 'ilms/digital-library-resource.pdf'],
                            'file_url' => ['type' => 'string', 'example' => 'http://127.0.0.1:8000/storage/ilms/digital-library-resource.pdf'],
                            'create_date' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'updated_at' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                        ],
                    ],
                    'ResearchProject' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'title' => ['type' => 'string', 'example' => 'AI Research Project'],
                            'funding_agency' => ['type' => 'string', 'example' => 'UGC'],
                            'amount' => ['type' => 'string', 'example' => '500000'],
                            'start_date' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'end_date' => ['type' => 'string', 'example' => '31-12-2026', 'description' => 'Date format: dd-mm-yyyy'],
                            'coordinator_name' => ['type' => 'string', 'example' => 'Dr. A. Kumar'],
                            'sanctioned_letter' => ['type' => 'string', 'example' => 'researchProject/sanction-letter.pdf'],
                            'sanctioned_letter_url' => ['type' => 'string', 'example' => 'http://127.0.0.1:8000/storage/researchProject/sanction-letter.pdf'],
                        ],
                    ],
                    'WorkshopSeminar' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],

                            'name' => [
                                'type' => 'string',
                                'example' => 'AI & ML Workshop'
                            ],

                            'participants' => [
                                'type' => 'string',
                                'example' => '120'
                            ],

                            'photo' => [
                                'type' => 'string',
                                'example' => 'workshopSeminars/photos/workshop-photo.jpg'
                            ],

                            'photo_url' => [
                                'type' => 'string',
                                'example' => 'http://127.0.0.1:8000/storage/workshopSeminars/photos/workshop-photo.jpg'
                            ],

                            'broucher' => [
                                'type' => 'string',
                                'example' => 'workshopSeminars/brouchers/workshop-broucher.pdf'
                            ],

                            'broucher_url' => [
                                'type' => 'string',
                                'example' => 'http://127.0.0.1:8000/storage/workshopSeminars/brouchers/workshop-broucher.pdf'
                            ],

                            'start_date' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],

                            'end_date' => [
                                'type' => 'string',
                                'example' => '10-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],

                            'preview' => [
                                'type' => 'string',
                                'nullable' => true,
                                'example' => '0'
                            ],
                        ],
                    ],
                    'Achievement' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],
                            'department_id' => ['type' => 'integer', 'example' => 3],
                            'user_name' => ['type' => 'string', 'example' => 'Jyoti'],
                            'name' => ['type' => 'string', 'example' => 'Dr. Ramesh Chandra Dash'],
                            'regd_no' => ['type' => 'string', 'example' => 'CS10R001'],
                            'guide' => ['type' => 'string', 'example' => 'Prof. A. Kumar'],
                            'date_of_award' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],
                            'subject' => ['type' => 'string', 'example' => 'Artificial Intelligence'],
                            'document' => [
                                'type' => 'string',
                                'example' => 'achievements/document.pdf'
                            ],
                            'document_url' => [
                                'type' => 'string',
                                'example' => 'http://127.0.0.1:8000/storage/achievements/document.pdf'
                            ],
                            'create_date' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],
                            'updated_at' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],
                            'preview' => [
                                'type' => 'string',
                                'nullable' => true,
                                'example' => '0'
                            ],
                        ],
                    ],
                    'ResearchScholar' => [
                        'type' => 'object',
                        'properties' => [
                            'id' => ['type' => 'integer', 'example' => 1],

                            'department_id' => [
                                'type' => 'integer',
                                'example' => 3
                            ],

                            'user_name' => [
                                'type' => 'string',
                                'example' => 'Jyoti'
                            ],

                            'name' => [
                                'type' => 'string',
                                'example' => 'John Doe'
                            ],

                            'email' => [
                                'type' => 'string',
                                'format' => 'email',
                                'example' => 'john.doe@example.com'
                            ],

                            'mentor_name' => [
                                'type' => 'string',
                                'example' => 'Dr. A. Kumar'
                            ],

                            'file' => [
                                'type' => 'string',
                                'example' => 'researchScholars/research-paper.pdf'
                            ],

                            'file_url' => [
                                'type' => 'string',
                                'example' => 'http://127.0.0.1:8000/storage/researchScholars/research-paper.pdf'
                            ],

                            'create_date' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],

                            'updated_at' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],

                            'preview' => [
                                'type' => 'string',
                                'nullable' => true,
                                'example' => '0'
                            ],
                        ],
                    ],
                    'ResearchSupervisor' => [
                        'type' => 'object',
                        'properties' => [

                            'id' => [
                                'type' => 'integer',
                                'example' => 1
                            ],

                            'department_id' => [
                                'type' => 'integer',
                                'example' => 3
                            ],

                            'user_name' => [
                                'type' => 'string',
                                'example' => 'Jyoti'
                            ],

                            'name' => [
                                'type' => 'string',
                                'example' => 'Dr. A. Kumar'
                            ],

                            'email' => [
                                'type' => 'string',
                                'format' => 'email',
                                'example' => 'dr.kumar@example.com'
                            ],

                            'intake' => [
                                'type' => 'string',
                                'example' => '10'
                            ],

                            'file' => [
                                'type' => 'string',
                                'example' => 'researchSupervisors/profile.pdf'
                            ],

                            'file_url' => [
                                'type' => 'string',
                                'example' => 'http://127.0.0.1:8000/storage/researchSupervisors/profile.pdf'
                            ],

                            'create_date' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],

                            'updated_at' => [
                                'type' => 'string',
                                'example' => '07-05-2026',
                                'description' => 'Date format: dd-mm-yyyy'
                            ],

                            'preview' => [
                                'type' => 'string',
                                'nullable' => true,
                                'example' => '0'
                            ],
                        ],
                    ],
                    'ValidationError' => [
                        'type' => 'object',
                        'properties' => [
                            'message' => ['type' => 'string', 'example' => 'The file field is required when link is not present.'],
                            'errors' => [
                                'type' => 'object',
                                'additionalProperties' => [
                                    'type' => 'array',
                                    'items' => ['type' => 'string'],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            'paths' => [
                '/login' => [
                    'post' => [
                        'tags' => ['Auth'],
                        'summary' => 'Login with email, and password',
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'application/json' => [
                                    'schema' => ['$ref' => '#/components/schemas/LoginRequest'],
                                ],
                            ],
                        ],
                        'responses' => [
                            '200' => [
                                'description' => 'Login successful',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/LoginResponse'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Invalid login details'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/register' => [
                    'post' => [
                        'tags' => ['Auth'],
                        'summary' => 'Register a user',
                        'description' => 'Creates a user with a hashed password.',
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'application/json' => [
                                    'schema' => ['$ref' => '#/components/schemas/RegisterRequest'],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'User registered',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/RegisterResponse'],
                                    ],
                                ],
                            ],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/departments' => [
                    'get' => [
                        'tags' => ['Departments'],
                        'summary' => 'Get all departments',
                        'responses' => [
                            '200' => [
                                'description' => 'Department list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/Department'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'post' => [
                        'tags' => ['Departments'],
                        'summary' => 'Create a department',
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['name'],
                                        'properties' => [
                                            'name' => ['type' => 'string', 'example' => 'Department of Physics'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'Department created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/Department'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/dashboard' => [
                    'get' => [
                        'tags' => ['Dashboard'],
                        'summary' => 'Open protected dashboard',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Dashboard details',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'message' => ['type' => 'string', 'example' => 'Dashboard opened successfully.'],
                                                'user' => ['$ref' => '#/components/schemas/User'],
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/notices' => [
                    'get' => [
                        'tags' => ['Notices'],
                        'summary' => 'Get notices for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Notice list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/Notice'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-notice' => [
                    'post' => [
                        'tags' => ['Notices'],
                        'summary' => 'Create a notice',
                        'description' => 'Send either file or link. File supports PDF, DOC, DOCX up to 5MB.',
                        'security' => [['bearerAuth' => []]],
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['title', 'category', 'publish_date', 'last_date'],
                                        'properties' => [
                                            'title' => ['type' => 'string', 'example' => 'Semester Exam Notice'],
                                            'category' => ['type' => 'string', 'example' => 'Exam'],
                                            'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, or DOCX. Max size: 5MB. Required if link is empty.'],
                                            'link' => ['type' => 'string', 'format' => 'uri', 'example' => 'https://example.com/notice', 'description' => 'Required if file is empty.'],
                                            'publish_date' => ['type' => 'string', 'format' => 'date', 'example' => '06-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                                            'last_date' => ['type' => 'string', 'format' => 'date', 'example' => '15-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'Notice created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/Notice'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/tenders' => [
                    'get' => [
                        'tags' => ['Tenders'],
                        'summary' => 'Get tenders for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Tender list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/Tender'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-tender' => [
                    'post' => [
                        'tags' => ['Tenders'],
                        'summary' => 'Create a tender',
                        'description' => 'Creates a tender for the logged-in user department. File supports PDF, DOC, DOCX up to 5MB.',
                        'security' => [['bearerAuth' => []]],
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['title', 'start_date', 'end_date'],
                                        'properties' => [
                                            'title' => ['type' => 'string', 'example' => 'Laboratory Equipment Tender'],
                                            'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, or DOCX. Max size: 5MB.'],
                                            'link' => ['type' => 'string', 'format' => 'uri', 'example' => 'https://example.com/tender'],
                                            'start_date' => ['type' => 'string', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                                            'end_date' => ['type' => 'string', 'example' => '20-05-2026', 'description' => 'Date format: dd-mm-yyyy. Must be after or equal to start_date.'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'Tender created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/Tender'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/news-events' => [
                    'get' => [
                        'tags' => ['News Events'],
                        'summary' => 'Get news and events for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'News and events list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/NewsEvent'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-news-events' => [
                    'post' => [
                        'tags' => ['News Events'],
                        'summary' => 'Create a news event',
                        'description' => 'Creates a news event for the logged-in user department. Send either file or link. File supports PDF, DOC, DOCX up to 5MB. Image is required and supports JPEG, PNG, JPG, SVG up to 2MB.',
                        'security' => [['bearerAuth' => []]],
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['title', 'image'],
                                        'properties' => [
                                            'title' => ['type' => 'string', 'example' => 'Department Seminar and Workshop'],
                                            'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, or DOCX. Max size: 5MB. Required if link is empty.'],
                                            'link' => ['type' => 'string', 'format' => 'uri', 'example' => 'https://example.com/news-event', 'description' => 'Required if file is empty.'],
                                            'image' => ['type' => 'string', 'format' => 'binary', 'description' => 'JPEG, PNG, JPG, or SVG. Max size: 2MB.'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'News event created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/NewsEvent'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/publications' => [
                    'get' => [
                        'tags' => ['Publications'],
                        'summary' => 'Get publications for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Publication list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/Publication'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-publication' => [
                    'post' => [
                        'tags' => ['Publications'],
                        'summary' => 'Create a publication',
                        'description' => 'Creates a publication entry for the logged-in user department. Send editor content in the content field.',
                        'security' => [['bearerAuth' => []]],
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'application/json' => [
                                    'schema' => ['$ref' => '#/components/schemas/PublicationRequest'],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'Publication created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/Publication'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/ilms' => [
                    'get' => [
                        'tags' => ['ILMS'],
                        'summary' => 'Get ILMS resources for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'ILMS resource list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/Ilms'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-ilms' => [
                    'post' => [
                        'tags' => ['ILMS'],
                        'summary' => 'Create an ILMS resource',
                        'description' => 'Creates an ILMS resource for the logged-in user department. File is required and supports PDF, DOC, DOCX up to 5MB.',
                        'security' => [['bearerAuth' => []]],
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['title', 'description', 'file'],
                                        'properties' => [
                                            'title' => ['type' => 'string', 'example' => 'Digital Library Resource'],
                                            'description' => ['type' => 'string', 'example' => 'Study material and LMS resources for department students.'],
                                            'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, or DOCX. Max size: 5MB.'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'ILMS resource created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/Ilms'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/research-projects' => [
                    'get' => [
                        'tags' => ['Research Projects'],
                        'summary' => 'Get research projects for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Research project list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/ResearchProject'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-research-project' => [
                    'post' => [
                        'tags' => ['Research Projects'],
                        'summary' => 'Create a research project',
                        'description' => 'Creates a research project for the logged-in user department. Sanctioned letter is required, PDF only, max size 5MB.',
                        'security' => [['bearerAuth' => []]],
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => ['title', 'funding_agency', 'amount', 'start_date', 'end_date', 'coordinator_name', 'sanctioned_letter'],
                                        'properties' => [
                                            'title' => ['type' => 'string', 'example' => 'AI Research Project'],
                                            'funding_agency' => ['type' => 'string', 'example' => 'UGC'],
                                            'amount' => ['type' => 'string', 'example' => '500000'],
                                            'start_date' => ['type' => 'string', 'format' => 'date', 'example' => '07-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                                            'end_date' => ['type' => 'string', 'format' => 'date', 'example' => '31-12-2026', 'description' => 'Date format: dd-mm-yyyy. Must be after or equal to start_date.'],
                                            'coordinator_name' => ['type' => 'string', 'example' => 'Dr. A. Kumar'],
                                            'sanctioned_letter' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF only. Max size: 5MB.'],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'Research project created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ResearchProject'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/workshop-seminars' => [
                    'get' => [
                        'tags' => ['Workshop Seminars'],
                        'summary' => 'Get workshop seminars for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Workshop seminar list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/WorkshopSeminar'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-workshop-seminar' => [
                    'post' => [
                        'tags' => ['Workshop Seminars'],
                        'summary' => 'Create a workshop seminar',
                        'description' => 'Creates a workshop seminar for the logged-in user department. Photo supports JPG, JPEG, PNG up to 2MB. Broucher supports PDF up to 5MB.',

                        'security' => [['bearerAuth' => []]],

                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',

                                        'required' => [
                                            'name',
                                            'participants',
                                            'photo',
                                            'broucher',
                                            'start_date',
                                            'end_date'
                                        ],

                                        'properties' => [

                                            'name' => [
                                                'type' => 'string',
                                                'example' => 'AI & ML Workshop'
                                            ],

                                            'participants' => [
                                                'type' => 'string',
                                                'example' => '120'
                                            ],

                                            'photo' => [
                                                'type' => 'string',
                                                'format' => 'binary',
                                                'description' => 'JPG, JPEG, PNG image. Max size: 2MB.'
                                            ],

                                            'broucher' => [
                                                'type' => 'string',
                                                'format' => 'binary',
                                                'description' => 'PDF document. Max size: 5MB.'
                                            ],

                                            'start_date' => [
                                                'type' => 'string',
                                                'format' => 'date',
                                                'example' => '07-05-2026',
                                                'description' => 'Date format: dd-mm-yyyy'
                                            ],

                                            'end_date' => [
                                                'type' => 'string',
                                                'format' => 'date',
                                                'example' => '10-05-2026',
                                                'description' => 'Date format: dd-mm-yyyy'
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],

                        'responses' => [

                            '201' => [
                                'description' => 'Workshop seminar created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            '$ref' => '#/components/schemas/WorkshopSeminar'
                                        ],
                                    ],
                                ],
                            ],

                            '401' => [
                                'description' => 'Unauthenticated'
                            ],

                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            '$ref' => '#/components/schemas/ValidationError'
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/achievements' => [
                    'get' => [
                        'tags' => ['Achievements'],
                        'summary' => 'Get achievements for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Achievement list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/Achievement'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-achievement' => [
                    'post' => [
                        'tags' => ['Achievements'],
                        'summary' => 'Create an achievement',
                        'description' => 'Creates an achievement for the logged-in user department. Document is required and supports PDF up to 5MB.',
                        'security' => [['bearerAuth' => []]],
                        'requestBody' => [
                            'required' => true,
                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'required' => [
                                            'name',
                                            'regd_no',
                                            'guide',
                                            'date_of_award',
                                            'subject',
                                            'document'
                                        ],
                                        'properties' => [
                                            'name' => [
                                                'type' => 'string',
                                                'example' => 'Dr. Ramesh Chandra Dash'
                                            ],
                                            'regd_no' => [
                                                'type' => 'string',
                                                'example' => 'CS10R001'
                                            ],
                                            'guide' => [
                                                'type' => 'string',
                                                'example' => 'Prof. A. Kumar'
                                            ],
                                            'date_of_award' => [
                                                'type' => 'string',
                                                'format' => 'date',
                                                'example' => '07-05-2026',
                                                'description' => 'Date format: dd-mm-yyyy'
                                            ],
                                            'subject' => [
                                                'type' => 'string',
                                                'example' => 'Artificial Intelligence'
                                            ],
                                            'document' => [
                                                'type' => 'string',
                                                'format' => 'binary',
                                                'description' => 'PDF document. Max size: 5MB.'
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'responses' => [
                            '201' => [
                                'description' => 'Achievement created',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/Achievement'],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                            '422' => [
                                'description' => 'Validation error',
                                'content' => [
                                    'application/json' => [
                                        'schema' => ['$ref' => '#/components/schemas/ValidationError'],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/research-scholars' => [
                    'get' => [
                        'tags' => ['Research Scholars'],
                        'summary' => 'Get research scholars for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Research scholar list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/ResearchScholar'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-research-scholar' => [
                    'post' => [
                        'tags' => ['Research Scholars'],

                        'summary' => 'Create a research scholar',

                        'description' => 'Creates a research scholar for the logged-in user department. File supports PDF, DOC, DOCX up to 5MB.',

                        'security' => [['bearerAuth' => []]],

                        'requestBody' => [
                            'required' => true,

                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [
                                        'type' => 'object',

                                        'required' => [
                                            'name',
                                            'email',
                                            'mentor_name',
                                            'file'
                                        ],

                                        'properties' => [

                                            'name' => [
                                                'type' => 'string',
                                                'example' => 'John Doe'
                                            ],

                                            'email' => [
                                                'type' => 'string',
                                                'format' => 'email',
                                                'example' => 'john.doe@example.com'
                                            ],

                                            'mentor_name' => [
                                                'type' => 'string',
                                                'example' => 'Dr. A. Kumar'
                                            ],

                                            'file' => [
                                                'type' => 'string',
                                                'format' => 'binary',
                                                'description' => 'PDF, DOC, or DOCX file. Max size: 5MB.'
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],

                        'responses' => [

                            '201' => [
                                'description' => 'Research scholar created',

                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            '$ref' => '#/components/schemas/ResearchScholar'
                                        ],
                                    ],
                                ],
                            ],

                            '401' => [
                                'description' => 'Unauthenticated'
                            ],

                            '422' => [
                                'description' => 'Validation error',

                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            '$ref' => '#/components/schemas/ValidationError'
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
                '/research-supervisors' => [
                    'get' => [
                        'tags' => ['Research Supervisors'],
                        'summary' => 'Get research supervisors for logged-in user department',
                        'security' => [['bearerAuth' => []]],
                        'responses' => [
                            '200' => [
                                'description' => 'Research supervisor list',
                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            'type' => 'array',
                                            'items' => ['$ref' => '#/components/schemas/ResearchSupervisor'],
                                        ],
                                    ],
                                ],
                            ],
                            '401' => ['description' => 'Unauthenticated'],
                        ],
                    ],
                ],
                '/add-research-supervisor' => [
                    'post' => [

                        'tags' => ['Research Supervisors'],

                        'summary' => 'Create a research supervisor',

                        'description' => 'Creates a research supervisor for the logged-in user department. File supports PDF, DOC, DOCX up to 5MB.',

                        'security' => [['bearerAuth' => []]],

                        'requestBody' => [
                            'required' => true,

                            'content' => [
                                'multipart/form-data' => [
                                    'schema' => [

                                        'type' => 'object',

                                        'required' => [
                                            'name',
                                            'email',
                                            'intake',
                                            'file'
                                        ],

                                        'properties' => [

                                            'name' => [
                                                'type' => 'string',
                                                'example' => 'Dr. A. Kumar'
                                            ],

                                            'email' => [
                                                'type' => 'string',
                                                'format' => 'email',
                                                'example' => 'dr.kumar@example.com'
                                            ],

                                            'intake' => [
                                                'type' => 'string',
                                                'example' => '10'
                                            ],

                                            'file' => [
                                                'type' => 'string',
                                                'format' => 'binary',
                                                'description' => 'PDF, DOC, or DOCX file. Max size: 5MB.'
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                        ],

                        'responses' => [

                            '201' => [
                                'description' => 'Research supervisor created',

                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            '$ref' => '#/components/schemas/ResearchSupervisor'
                                        ],
                                    ],
                                ],
                            ],

                            '401' => [
                                'description' => 'Unauthenticated'
                            ],

                            '422' => [
                                'description' => 'Validation error',

                                'content' => [
                                    'application/json' => [
                                        'schema' => [
                                            '$ref' => '#/components/schemas/ValidationError'
                                        ],
                                    ],
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }
}
