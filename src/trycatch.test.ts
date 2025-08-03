import tape from "tape";
import { trycatch, ok, err } from "./trycatch";

const TEST_ERROR = new Error("test error");

tape("trycatch", async (assert: tape.Test) => {
	{
		const [value, error] = trycatch(() => 1);
		assert.equals(value, 1);
		assert.equals(error, undefined);
	}
	{
		const [value, error] = await trycatch(() => Promise.resolve(1));
		assert.equals(value, 1);
		assert.equals(error, undefined);
	}
	{
		const [value, error] = trycatch(() => {
			// biome-ignore lint/correctness/noConstantCondition: testing
			if (true) {
				throw TEST_ERROR;
			}
			return 1;
		});
		assert.equals(value, undefined);
		assert.equals(error, TEST_ERROR);
	}
	{
		const [value, error] = await trycatch(() =>
			Promise.reject<number>(TEST_ERROR),
		);
		assert.equals(value, undefined);
		assert.equals(error, TEST_ERROR);
	}

	assert.deepEqual(
		await trycatch(
			async () => new Promise<boolean>((resolve) => resolve(true)),
		),
		ok(true),
	);
	assert.deepEqual(
		await trycatch(
			() => new Promise<void>((_resolve, reject) => reject(TEST_ERROR)),
		),
		err(TEST_ERROR),
	);

	assert.deepEqual(
		await trycatch(new Promise<boolean>((resolve) => resolve(true))),
		ok(true),
	);
	assert.deepEqual(
		await trycatch(new Promise<void>((_resolve, reject) => reject(TEST_ERROR))),
		err(TEST_ERROR),
	);

	assert.end();
});
