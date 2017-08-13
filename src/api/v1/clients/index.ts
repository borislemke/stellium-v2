import { Router } from 'express'
import { registerClient } from './register_client'

// api/v1/clients
export const V1ClientsRouter: Router = Router()

V1ClientsRouter.post('/', registerClient) // Register client

V1ClientsRouter.get('/') // Index client

V1ClientsRouter.get('/:clientId') // Get client by ID
