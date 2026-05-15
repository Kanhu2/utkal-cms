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
        $schemas = $this->schemas();
        $paths = $this->basePaths();

        foreach ($this->cmsResources() as $resource) {
            $paths[$resource['listPath']] = [
                'get' => $this->listOperation($resource),
            ];

            $paths[$resource['addPath']] = [
                'post' => $this->createOperation($resource),
            ];

            $paths[$resource['editPath']] = [
                'post' => $this->updateOperation($resource),
            ];

            $paths[$resource['deletePath']] = [
                'delete' => $this->deleteOperation($resource),
            ];
        }

        return response()->json([
            'openapi' => '3.0.3',
            'info' => [
                'title' => 'Utkal CMS API',
                'version' => '1.0.0',
                'description' => 'API documentation for Utkal CMS admin, content, edit, and delete endpoints.',
            ],
            'servers' => [
                [
                    'url' => url('/api'),
                    'description' => 'API server',
                ],
            ],
            'components' => [
                'securitySchemes' => [
                    'bearerAuth' => [
                        'type' => 'http',
                        'scheme' => 'bearer',
                        'bearerFormat' => 'JWT',
                        'description' => 'Paste only the access_token value from login. Swagger adds Bearer automatically.',
                    ],
                ],
                'schemas' => $schemas,
            ],
            'paths' => $paths,
            'tags' => [
                ['name' => 'Auth'],
                ['name' => 'Departments'],
                ['name' => 'Dashboard'],
                ['name' => 'Notices'],
                ['name' => 'Tenders'],
                ['name' => 'News Events'],
                ['name' => 'Publications'],
                ['name' => 'ILMS'],
                ['name' => 'Research Projects'],
                ['name' => 'Workshop Seminars'],
                ['name' => 'Achievements'],
                ['name' => 'Research Scholars'],
                ['name' => 'Research Supervisors'],
            ],
        ]);
    }

    private function basePaths(): array
    {
        return [
            '/login' => [
                'post' => [
                    'tags' => ['Auth'],
                    'summary' => 'Login',
                    'requestBody' => $this->jsonBody('LoginRequest'),
                    'responses' => [
                        '200' => $this->jsonResponse('Login successful', 'LoginResponse'),
                        '401' => $this->jsonResponse('Invalid login details', 'Error'),
                        '422' => $this->jsonResponse('Validation error', 'ValidationError'),
                    ],
                ],
            ],
            '/create_admin' => [
                'post' => [
                    'tags' => ['Auth'],
                    'summary' => 'Create admin user',
                    'requestBody' => $this->jsonBody('CreateAdminRequest'),
                    'responses' => [
                        '201' => $this->jsonResponse('Admin user created', 'UserResponse'),
                        '422' => $this->jsonResponse('Validation error', 'ValidationError'),
                    ],
                ],
            ],
            '/register' => [
                'post' => [
                    'tags' => ['Auth'],
                    'summary' => 'Register employee user',
                    'requestBody' => $this->jsonBody('RegisterRequest'),
                    'responses' => [
                        '201' => $this->jsonResponse('User registered', 'UserResponse'),
                        '422' => $this->jsonResponse('Validation error', 'ValidationError'),
                    ],
                ],
            ],
            '/users' => [
                'get' => [
                    'tags' => ['Auth'],
                    'summary' => 'List employee users',
                    'responses' => [
                        '200' => $this->arrayResponse('Employee users', 'User'),
                    ],
                ],
            ],
            '/departments' => [
                'get' => [
                    'tags' => ['Departments'],
                    'summary' => 'List departments',
                    'responses' => [
                        '200' => $this->arrayResponse('Department list', 'Department'),
                    ],
                ],
                'post' => [
                    'tags' => ['Departments'],
                    'summary' => 'Create department',
                    'requestBody' => $this->jsonBody('DepartmentRequest'),
                    'responses' => [
                        '201' => $this->jsonResponse('Department created', 'Department'),
                        '422' => $this->jsonResponse('Validation error', 'ValidationError'),
                    ],
                ],
            ],
            '/dashboard' => [
                'get' => [
                    'tags' => ['Dashboard'],
                    'summary' => 'Dashboard summary',
                    'security' => [['bearerAuth' => []]],
                    'responses' => [
                        '200' => [
                            'description' => 'Dashboard data',
                            'content' => [
                                'application/json' => [
                                    'schema' => ['type' => 'object'],
                                ],
                            ],
                        ],
                        '401' => $this->jsonResponse('Unauthenticated', 'Error'),
                    ],
                ],
            ],
        ];
    }

    private function cmsResources(): array
    {
        return [
            [
                'tag' => 'Notices',
                'name' => 'notice',
                'schema' => 'Notice',
                'listPath' => '/notices',
                'addPath' => '/add-notice',
                'editPath' => '/edit-notice/{id}',
                'deletePath' => '/delete-notice/{id}',
                'createRequired' => ['title', 'category', 'publish_date', 'last_date'],
                'updateRequired' => ['title', 'category', 'publish_date', 'last_date'],
                'jsonProperties' => [
                    'title' => ['type' => 'string', 'example' => 'Semester exam notice'],
                    'category' => ['type' => 'string', 'example' => 'General'],
                    'link' => ['type' => 'string', 'format' => 'uri', 'example' => 'https://example.com/notice'],
                    'publish_date' => ['type' => 'string', 'format' => 'date', 'example' => '2026-05-15'],
                    'last_date' => ['type' => 'string', 'format' => 'date', 'example' => '2026-05-20'],
                ],
                'fileProperties' => [
                    'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX. Max 5MB.'],
                ],
            ],
            [
                'tag' => 'Tenders',
                'name' => 'tender',
                'schema' => 'Tender',
                'listPath' => '/tenders',
                'addPath' => '/add-tender',
                'editPath' => '/edit-tender/{id}',
                'deletePath' => '/delete-tender/{id}',
                'createRequired' => ['title', 'start_date', 'end_date'],
                'updateRequired' => ['title', 'start_date', 'end_date'],
                'jsonProperties' => [
                    'title' => ['type' => 'string', 'example' => 'Laboratory equipment tender'],
                    'link' => ['type' => 'string', 'format' => 'uri', 'example' => 'https://example.com/tender'],
                    'start_date' => ['type' => 'string', 'example' => '15-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                    'end_date' => ['type' => 'string', 'example' => '25-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                ],
                'fileProperties' => [
                    'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX. Max 5MB.'],
                ],
            ],
            [
                'tag' => 'News Events',
                'name' => 'news/event',
                'schema' => 'NewsEvent',
                'listPath' => '/news-events',
                'addPath' => '/add-news-events',
                'editPath' => '/edit-news-events/{id}',
                'deletePath' => '/delete-news-events/{id}',
                'createRequired' => ['title', 'image'],
                'updateRequired' => ['title'],
                'jsonProperties' => [
                    'title' => ['type' => 'string', 'example' => 'Department seminar'],
                    'link' => ['type' => 'string', 'format' => 'uri', 'example' => 'https://example.com/news'],
                ],
                'fileProperties' => [
                    'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX. Max 5MB.'],
                    'image' => ['type' => 'string', 'format' => 'binary', 'description' => 'JPG, JPEG, PNG, SVG. Max 2MB. Required for create.'],
                ],
            ],
            [
                'tag' => 'Publications',
                'name' => 'publication',
                'schema' => 'Publication',
                'listPath' => '/publications',
                'addPath' => '/add-publication',
                'editPath' => '/edit-publication/{id}',
                'deletePath' => '/delete-publication/{id}',
                'createRequired' => ['content'],
                'updateRequired' => ['content'],
                'jsonProperties' => [
                    'content' => ['type' => 'string', 'example' => '<p>Publication details</p>'],
                ],
                'fileProperties' => [],
            ],
            [
                'tag' => 'ILMS',
                'name' => 'ILMS',
                'schema' => 'Ilms',
                'listPath' => '/ilms',
                'addPath' => '/add-ilms',
                'editPath' => '/edit-ilms/{id}',
                'deletePath' => '/delete-ilms/{id}',
                'createRequired' => ['title', 'description', 'file'],
                'updateRequired' => ['title', 'description'],
                'jsonProperties' => [
                    'title' => ['type' => 'string', 'example' => 'Example ILMS'],
                    'description' => ['type' => 'string', 'example' => 'This is a simple example of ILMS'],
                ],
                'fileProperties' => [
                    'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX, PPT, PPTX, MP4. Max 100MB. Required for create.'],
                ],
            ],
            [
                'tag' => 'Research Projects',
                'name' => 'research project',
                'schema' => 'ResearchProject',
                'listPath' => '/research-projects',
                'addPath' => '/add-research-project',
                'editPath' => '/edit-research-project/{id}',
                'deletePath' => '/delete-research-project/{id}',
                'createRequired' => ['title', 'funding_agency', 'amount', 'start_date', 'end_date', 'coordinator_name', 'sanctioned_letter'],
                'updateRequired' => ['title', 'funding_agency', 'amount', 'start_date', 'end_date', 'coordinator_name'],
                'jsonProperties' => [
                    'title' => ['type' => 'string', 'example' => 'AI research project'],
                    'funding_agency' => ['type' => 'string', 'example' => 'UGC'],
                    'amount' => ['type' => 'string', 'example' => '500000'],
                    'start_date' => ['type' => 'string', 'format' => 'date', 'example' => '2026-05-15'],
                    'end_date' => ['type' => 'string', 'format' => 'date', 'example' => '2026-12-31'],
                    'coordinator_name' => ['type' => 'string', 'example' => 'Dr. A. Kumar'],
                ],
                'fileProperties' => [
                    'sanctioned_letter' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF. Max 5MB. Required for create.'],
                ],
            ],
            [
                'tag' => 'Workshop Seminars',
                'name' => 'workshop/seminar',
                'schema' => 'WorkshopSeminar',
                'listPath' => '/workshop-seminars',
                'addPath' => '/add-workshop-seminar',
                'editPath' => '/edit-workshop-seminar/{id}',
                'deletePath' => '/delete-workshop-seminar/{id}',
                'createRequired' => ['name', 'participants', 'photo', 'broucher', 'start_date', 'end_date'],
                'updateRequired' => ['name', 'participants', 'start_date', 'end_date'],
                'jsonProperties' => [
                    'name' => ['type' => 'string', 'example' => 'AI and ML workshop'],
                    'participants' => ['type' => 'integer', 'example' => 120],
                    'start_date' => ['type' => 'string', 'example' => '15-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                    'end_date' => ['type' => 'string', 'example' => '17-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                ],
                'fileProperties' => [
                    'photo' => ['type' => 'string', 'format' => 'binary', 'description' => 'JPG, JPEG, PNG, SVG. Max 2MB. Required for create.'],
                    'broucher' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX. Max 5MB. Required for create.'],
                ],
            ],
            [
                'tag' => 'Achievements',
                'name' => 'achievement',
                'schema' => 'Achievement',
                'listPath' => '/achievements',
                'addPath' => '/add-achievement',
                'editPath' => '/edit-achievement/{id}',
                'deletePath' => '/delete-achievement/{id}',
                'createRequired' => ['name', 'regd_no', 'guide', 'date_of_award', 'subject'],
                'updateRequired' => ['name', 'regd_no', 'guide', 'date_of_award', 'subject'],
                'jsonProperties' => [
                    'name' => ['type' => 'string', 'example' => 'Dr. Ramesh Chandra Dash'],
                    'regd_no' => ['type' => 'string', 'example' => 'CS10R001'],
                    'guide' => ['type' => 'string', 'example' => 'Prof. A. Kumar'],
                    'date_of_award' => ['type' => 'string', 'example' => '15-05-2026', 'description' => 'Date format: dd-mm-yyyy'],
                    'subject' => ['type' => 'string', 'example' => 'Artificial Intelligence'],
                ],
                'fileProperties' => [
                    'document' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX. Max 5MB. Optional.'],
                ],
            ],
            [
                'tag' => 'Research Scholars',
                'name' => 'research scholar',
                'schema' => 'ResearchScholar',
                'listPath' => '/research-scholars',
                'addPath' => '/add-research-scholar',
                'editPath' => '/edit-research-scholar/{id}',
                'deletePath' => '/delete-research-scholar/{id}',
                'createRequired' => ['name', 'email', 'mentor_name', 'file'],
                'updateRequired' => ['name', 'email', 'mentor_name'],
                'jsonProperties' => [
                    'name' => ['type' => 'string', 'example' => 'John Doe'],
                    'email' => ['type' => 'string', 'format' => 'email', 'example' => 'john@example.com'],
                    'mentor_name' => ['type' => 'string', 'example' => 'Dr. A. Kumar'],
                ],
                'fileProperties' => [
                    'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX. Max 5MB. Required for create.'],
                ],
            ],
            [
                'tag' => 'Research Supervisors',
                'name' => 'research supervisor',
                'schema' => 'ResearchSupervisor',
                'listPath' => '/research-supervisors',
                'addPath' => '/add-research-supervisor',
                'editPath' => '/edit-research-supervisor/{id}',
                'deletePath' => '/delete-research-supervisor/{id}',
                'createRequired' => ['name', 'email', 'intake', 'file'],
                'updateRequired' => ['name', 'email', 'intake'],
                'jsonProperties' => [
                    'name' => ['type' => 'string', 'example' => 'Dr. A. Kumar'],
                    'email' => ['type' => 'string', 'format' => 'email', 'example' => 'dr.kumar@example.com'],
                    'intake' => ['type' => 'integer', 'example' => 10],
                ],
                'fileProperties' => [
                    'file' => ['type' => 'string', 'format' => 'binary', 'description' => 'PDF, DOC, DOCX. Max 5MB. Required for create.'],
                ],
            ],
        ];
    }

    private function listOperation(array $resource): array
    {
        return [
            'tags' => [$resource['tag']],
            'summary' => 'List ' . $resource['tag'],
            'security' => [['bearerAuth' => []]],
            'responses' => [
                '200' => $this->arrayResponse($resource['tag'] . ' list', $resource['schema']),
                '401' => $this->jsonResponse('Unauthenticated', 'Error'),
            ],
        ];
    }

    private function createOperation(array $resource): array
    {
        return [
            'tags' => [$resource['tag']],
            'summary' => 'Create ' . $resource['name'],
            'security' => [['bearerAuth' => []]],
            'requestBody' => $this->requestBody($resource, $resource['createRequired'], true),
            'responses' => [
                '201' => $this->jsonResponse(ucfirst($resource['name']) . ' created', $resource['schema']),
                '401' => $this->jsonResponse('Unauthenticated', 'Error'),
                '422' => $this->jsonResponse('Validation error', 'ValidationError'),
            ],
        ];
    }

    private function updateOperation(array $resource): array
    {
        return [
            'tags' => [$resource['tag']],
            'summary' => 'Update ' . $resource['name'] . ' by ID',
            'security' => [['bearerAuth' => []]],
            'parameters' => [$this->idParameter()],
            'requestBody' => $this->requestBody($resource, $resource['updateRequired'], false),
            'responses' => [
                '200' => $this->jsonResponse(ucfirst($resource['name']) . ' updated', $resource['schema']),
                '401' => $this->jsonResponse('Unauthenticated', 'Error'),
                '404' => $this->jsonResponse('Record not found', 'Error'),
                '422' => $this->jsonResponse('Validation error', 'ValidationError'),
            ],
        ];
    }

    private function deleteOperation(array $resource): array
    {
        return [
            'tags' => [$resource['tag']],
            'summary' => 'Delete ' . $resource['name'] . ' by ID',
            'security' => [['bearerAuth' => []]],
            'parameters' => [$this->idParameter()],
            'responses' => [
                '200' => $this->jsonResponse(ucfirst($resource['name']) . ' deleted', 'MessageResponse'),
                '401' => $this->jsonResponse('Unauthenticated', 'Error'),
                '404' => $this->jsonResponse('Record not found', 'Error'),
            ],
        ];
    }

    private function requestBody(array $resource, array $required, bool $isCreate): array
    {
        return [
            'required' => true,
            'description' => $isCreate
                ? 'Create payload.'
                : 'Update payload. File fields are optional on edit unless noted.',
            'content' => [
                'multipart/form-data' => [
                    'schema' => [
                        'type' => 'object',
                        'required' => $required,
                        'properties' => array_merge(
                            $resource['jsonProperties'],
                            $resource['fileProperties']
                        ),
                    ],
                ],
            ],
        ];
    }

    private function schemas(): array
    {
        return [
            'Error' => [
                'type' => 'object',
                'properties' => [
                    'message' => ['type' => 'string', 'example' => 'Error message'],
                    'exception' => ['type' => 'string', 'nullable' => true],
                ],
            ],
            'ValidationError' => [
                'type' => 'object',
                'properties' => [
                    'message' => ['type' => 'string', 'example' => 'The title field is required.'],
                    'errors' => ['type' => 'object'],
                ],
            ],
            'MessageResponse' => [
                'type' => 'object',
                'properties' => [
                    'message' => ['type' => 'string', 'example' => 'Deleted successfully.'],
                ],
            ],
            'DepartmentRequest' => [
                'type' => 'object',
                'required' => ['name'],
                'properties' => [
                    'name' => ['type' => 'string', 'example' => 'Department of Computer Science'],
                ],
            ],
            'Department' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer', 'example' => 1],
                    'name' => ['type' => 'string', 'example' => 'Department of Computer Science'],
                ],
            ],
            'CreateAdminRequest' => [
                'type' => 'object',
                'required' => ['name', 'email', 'password'],
                'properties' => [
                    'name' => ['type' => 'string', 'example' => 'Admin'],
                    'email' => ['type' => 'string', 'format' => 'email', 'example' => 'admin@example.com'],
                    'password' => ['type' => 'string', 'format' => 'password', 'example' => 'secret123'],
                ],
            ],
            'RegisterRequest' => [
                'type' => 'object',
                'required' => ['name', 'email', 'password', 'assigned_modules', 'department_id'],
                'properties' => [
                    'name' => ['type' => 'string', 'example' => 'Employee User'],
                    'email' => ['type' => 'string', 'format' => 'email', 'example' => 'employee@example.com'],
                    'password' => ['type' => 'string', 'format' => 'password', 'example' => 'secret123'],
                    'assigned_modules' => [
                        'type' => 'array',
                        'items' => ['type' => 'string'],
                        'example' => ['notice', 'tender'],
                    ],
                    'department_id' => ['type' => 'integer', 'example' => 1],
                ],
            ],
            'LoginRequest' => [
                'type' => 'object',
                'required' => ['email', 'password'],
                'properties' => [
                    'email' => ['type' => 'string', 'format' => 'email', 'example' => 'admin@example.com'],
                    'password' => ['type' => 'string', 'format' => 'password', 'example' => 'secret123'],
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
            'UserResponse' => [
                'type' => 'object',
                'properties' => [
                    'message' => ['type' => 'string', 'example' => 'User created successfully.'],
                    'user' => ['$ref' => '#/components/schemas/User'],
                    'admin' => ['$ref' => '#/components/schemas/User'],
                ],
            ],
            'User' => [
                'type' => 'object',
                'properties' => [
                    'id' => ['type' => 'integer', 'example' => 1],
                    'name' => ['type' => 'string', 'example' => 'Employee User'],
                    'email' => ['type' => 'string', 'format' => 'email', 'example' => 'employee@example.com'],
                    'role' => ['type' => 'string', 'example' => 'employee'],
                    'assigned_modules' => ['type' => 'string', 'nullable' => true, 'example' => 'notice,tender'],
                    'department_id' => ['type' => 'integer', 'nullable' => true, 'example' => 1],
                ],
            ],
            'Notice' => $this->contentSchema([
                'title' => ['type' => 'string'],
                'category' => ['type' => 'string'],
                'file' => ['type' => 'string', 'nullable' => true],
                'file_url' => ['type' => 'string', 'nullable' => true],
                'link' => ['type' => 'string', 'nullable' => true],
                'publish_date' => ['type' => 'string'],
                'last_date' => ['type' => 'string'],
            ]),
            'Tender' => $this->contentSchema([
                'title' => ['type' => 'string'],
                'file' => ['type' => 'string', 'nullable' => true],
                'file_url' => ['type' => 'string', 'nullable' => true],
                'link' => ['type' => 'string', 'nullable' => true],
                'start_date' => ['type' => 'string'],
                'end_date' => ['type' => 'string'],
            ]),
            'NewsEvent' => $this->contentSchema([
                'title' => ['type' => 'string'],
                'file' => ['type' => 'string', 'nullable' => true],
                'file_url' => ['type' => 'string', 'nullable' => true],
                'link' => ['type' => 'string', 'nullable' => true],
                'image' => ['type' => 'string', 'nullable' => true],
                'image_url' => ['type' => 'string', 'nullable' => true],
                'create_date' => ['type' => 'string'],
                'updated_at' => ['type' => 'string'],
            ]),
            'Publication' => $this->contentSchema([
                'publication_details' => ['type' => 'string'],
                'create_date' => ['type' => 'string'],
                'updated_at' => ['type' => 'string'],
            ]),
            'Ilms' => $this->contentSchema([
                'title' => ['type' => 'string'],
                'description' => ['type' => 'string'],
                'file' => ['type' => 'string', 'nullable' => true],
                'file_url' => ['type' => 'string', 'nullable' => true],
                'create_date' => ['type' => 'string'],
                'updated_at' => ['type' => 'string'],
            ]),
            'ResearchProject' => $this->contentSchema([
                'title' => ['type' => 'string'],
                'funding_agency' => ['type' => 'string'],
                'amount' => ['type' => 'string'],
                'start_date' => ['type' => 'string'],
                'end_date' => ['type' => 'string'],
                'coordinator_name' => ['type' => 'string'],
                'sanctioned_letter' => ['type' => 'string', 'nullable' => true],
                'sanctioned_letter_url' => ['type' => 'string', 'nullable' => true],
            ]),
            'WorkshopSeminar' => $this->contentSchema([
                'name' => ['type' => 'string'],
                'participants' => ['type' => 'integer'],
                'photo' => ['type' => 'string', 'nullable' => true],
                'photo_url' => ['type' => 'string', 'nullable' => true],
                'broucher' => ['type' => 'string', 'nullable' => true],
                'broucher_url' => ['type' => 'string', 'nullable' => true],
                'start_date' => ['type' => 'string'],
                'end_date' => ['type' => 'string'],
            ]),
            'Achievement' => $this->contentSchema([
                'name' => ['type' => 'string'],
                'regd_no' => ['type' => 'string'],
                'guide' => ['type' => 'string'],
                'date_of_award' => ['type' => 'string'],
                'subject' => ['type' => 'string'],
                'document' => ['type' => 'string', 'nullable' => true],
                'document_url' => ['type' => 'string', 'nullable' => true],
                'create_date' => ['type' => 'string'],
                'updated_at' => ['type' => 'string'],
            ]),
            'ResearchScholar' => $this->contentSchema([
                'name' => ['type' => 'string'],
                'email' => ['type' => 'string', 'format' => 'email'],
                'mentor_name' => ['type' => 'string'],
                'file' => ['type' => 'string', 'nullable' => true],
                'file_url' => ['type' => 'string', 'nullable' => true],
                'create_date' => ['type' => 'string'],
                'updated_at' => ['type' => 'string'],
            ]),
            'ResearchSupervisor' => $this->contentSchema([
                'name' => ['type' => 'string'],
                'email' => ['type' => 'string', 'format' => 'email'],
                'intake' => ['type' => 'integer'],
                'file' => ['type' => 'string', 'nullable' => true],
                'file_url' => ['type' => 'string', 'nullable' => true],
                'create_date' => ['type' => 'string'],
                'updated_at' => ['type' => 'string'],
            ]),
        ];
    }

    private function contentSchema(array $properties): array
    {
        return [
            'type' => 'object',
            'properties' => array_merge([
                'id' => ['type' => 'integer', 'example' => 1],
                'department_id' => ['type' => 'integer', 'nullable' => true, 'example' => 1],
                'updated_by' => ['type' => 'string', 'nullable' => true, 'example' => 'Admin'],
                'user_name' => ['type' => 'string', 'nullable' => true, 'example' => 'Admin'],
                'preview' => ['type' => 'integer', 'nullable' => true, 'example' => 0],
            ], $properties),
        ];
    }

    private function idParameter(): array
    {
        return [
            'name' => 'id',
            'in' => 'path',
            'required' => true,
            'schema' => ['type' => 'integer'],
            'example' => 1,
        ];
    }

    private function jsonBody(string $schema): array
    {
        return [
            'required' => true,
            'content' => [
                'multipart/form-data' => [
                    'schema' => [
                        '$ref' => '#/components/schemas/' . $schema,
                    ],
                ],
            ],
        ];
    }

    private function jsonResponse(string $description, string $schema): array
    {
        return [
            'description' => $description,
            'content' => [
                'application/json' => [
                    'schema' => ['$ref' => '#/components/schemas/' . $schema],
                ],
            ],
        ];
    }

    private function arrayResponse(string $description, string $schema): array
    {
        return [
            'description' => $description,
            'content' => [
                'application/json' => [
                    'schema' => [
                        'type' => 'array',
                        'items' => ['$ref' => '#/components/schemas/' . $schema],
                    ],
                ],
            ],
        ];
    }
}
