import { NextResponse } from 'next/server';

interface SuccessResponse<T> {
	status: 'success';
	data: T;
}

interface ErrorResponse {
	status: 'fail' | 'error';
	message: string;
}

export const successResponse = <T>(data: T) => {
	return NextResponse.json<SuccessResponse<T>>(
		{
			status: 'success',
			data: data
		},
		{ status: 200 }
	);
};

export const createdResponse = <T>(data: T) => {
	return NextResponse.json<SuccessResponse<T>>(
		{
			status: 'success',
			data: data
		},
		{ status: 201 }
	);
};

export const badRequestResponse = (message: string) => {
	return NextResponse.json<ErrorResponse>(
		{
			status: 'fail',
			message: message
		},
		{ status: 400 }
	);
};

export const unauthorizedResponse = (message: string) => {
	return NextResponse.json<ErrorResponse>(
		{
			status: 'fail',
			message: message
		},
		{ status: 401 }
	);
};

export const forbiddenResponse = (message: string) => {
	return NextResponse.json<ErrorResponse>(
		{
			status: 'fail',
			message: message
		},
		{ status: 403 }
	);
};

export const notFoundResponse = (message: string) => {
	return NextResponse.json<ErrorResponse>(
		{
			status: 'fail',
			message: message
		},
		{ status: 404 }
	);
};

export const internalServerErrorResponse = (message: string) => {
	return NextResponse.json<ErrorResponse>(
		{
			status: 'error',
			message: message
		},
		{ status: 500 }
	);
};