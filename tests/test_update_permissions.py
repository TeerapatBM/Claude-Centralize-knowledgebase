import importlib.util
import os
from pathlib import Path
import stat
import tempfile
import unittest
from unittest import mock

spec = importlib.util.spec_from_file_location(
    'veltrix_update', Path(__file__).resolve().parents[1] / 'deployment/update-onprem.py'
)
update = importlib.util.module_from_spec(spec)
spec.loader.exec_module(update)


class PrivateBackupTests(unittest.TestCase):
    def test_backups_preserve_umask_for_git_checkout(self):
        original = os.umask(0o022)
        try:
            with tempfile.TemporaryDirectory() as directory:
                path = Path(directory) / 'protected-backup'
                with mock.patch.object(update.os, 'umask', side_effect=AssertionError('Backup must not change process umask')):
                    update.write_private(path, 'synthetic secret')
                if os.name == 'posix':
                    actual = os.umask(0o022)
                    self.assertEqual(actual, 0o022, 'Backup changed checkout process umask')
                self.assertEqual(path.read_bytes(), b'synthetic secret')
                if os.name == 'posix':
                    self.assertEqual(stat.S_IMODE(path.stat().st_mode), 0o600)
                with self.assertRaises(FileExistsError):
                    update.write_private(path, 'overwrite')
        finally:
            os.umask(original)

    def test_restrictive_callers_stay_restrictive(self):
        original = os.umask(0o077)
        try:
            with tempfile.TemporaryDirectory() as directory:
                with mock.patch.object(update.os, 'umask', side_effect=AssertionError('Backup must not change process umask')):
                    update.write_private(Path(directory) / 'backup', b'fixture')
                if os.name == 'posix':
                    self.assertEqual(os.umask(0o077), 0o077)
        finally:
            os.umask(original)


if __name__ == '__main__':
    unittest.main()
